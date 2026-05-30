export function Testimonial() {
  return (
    <figure style={{ margin: 0, maxWidth: 760 }}>
      <blockquote style={{ margin: 0, fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 24, lineHeight: 1.45, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
        &ldquo;Our daughter went from a worried C in Higher Maths to a comfortable B+ in just one term. The class is small, the workbook is brilliant, and she actually{' '}
        <span style={{ background: 'rgba(229,143,63,0.18)', padding: '0 6px', borderRadius: 4 }}>looks forward</span>
        {' '}to Saturdays now.&rdquo;
      </blockquote>
      <figcaption style={{ fontFamily: 'var(--font-ui)', fontSize: 13, marginTop: 18, color: 'var(--fg-2)' }}>
        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>Aoife M.</span> · parent · 6th Year, Higher Maths
      </figcaption>
    </figure>
  )
}
