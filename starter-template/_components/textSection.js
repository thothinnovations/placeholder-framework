module.exports = function textSection(options) {
    // Set data values (optional):
    const headingText = options.headingText    || '';
    const paragraphs  = options.paragraphs     || [];
    const classes     = options.classes        || 'px-0';
  
    // Return HTML code:
    return `
    <!----------------------------------------------->
    
    <section class="${classes}">
      ${headingText != '' ? `<h1 class='mb-3'>${headingText}</h1>` : ''}
      
      ${paragraphs.map(p => `<p>${p}</p>`).join('')}
    </section>
    
    <!----------------------------------------------->
    `;
  };
  