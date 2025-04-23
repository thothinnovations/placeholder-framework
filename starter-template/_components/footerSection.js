module.exports = function footerSection(options) {
    // Set data values (optional):
    const footerText = options.footerText  || 'Created by <code>placeholder-framework</code> &middot; &copy; 2025';
    const classes    = options.classes     || 'container pt-3 my-5 text-body-secondary border-top';
  
    // Return HTML code:
    return `
    <!----------------------------------------------->
    
    <footer class="${classes}">
      ${footerText}
    </footer>
    
    <!----------------------------------------------->
    `;
  };
  