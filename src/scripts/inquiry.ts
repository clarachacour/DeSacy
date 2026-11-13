// Sends every inquiry form (data-kind="contact" | "create") to /api/inquiry, which emails it through Brevo.
type Data = Record<string, string>;
type Check = (data: Data) => string | null;

export function wireInquiryForms(extraCheck?: Check) {
  document.querySelectorAll<HTMLFormElement>('form.inq').forEach((form) => {
    const note = form.querySelector<HTMLElement>('[data-note]')!;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const defaultNote = note.textContent;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data: Data = { kind: form.dataset.kind ?? 'contact', page: location.pathname };
      new FormData(form).forEach((v, k) => (data[k] = String(v)));

      const problem =
        extraCheck?.(data) ??
        (!data.name?.trim() ? 'Add your name so we know who to contact.' : null) ??
        (!/^\S+@\S+\.\S+$/.test(data.email ?? '') && (data.phone ?? '').replace(/\D/g, '').length < 8
          ? 'Add an email address or a phone number so we can reach you.'
          : null) ??
        (form.dataset.kind === 'contact' && !data.message?.trim() ? 'Write a short message.' : null);
      if (problem) return show(problem, true);

      button.disabled = true;
      show('Sending…', false);
      try {
        const res = await fetch('/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(String(res.status));
        const box = document.createElement('div');
        box.className = 'sent';
        box.setAttribute('role', 'status');
        box.textContent = `Thank you, ${data.name.trim()}. Your message has reached Maison De Sacy and we will contact you within two working days.`;
        form.replaceWith(box);
      } catch {
        button.disabled = false;
        show('Your message could not be sent. Please try again, or write to us directly using the email address on this page.', true);
      }
    });

    function show(text: string, isError: boolean) {
      note.textContent = text || defaultNote;
      note.classList.toggle('error', isError);
    }
  });
}
