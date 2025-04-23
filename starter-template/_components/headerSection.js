module.exports = function headerSection(options) {
  // Set data values (optional):
  const displayLogo    = options.displayLogo  || true;
  const headingText    = options.headingText  || 'Starter template';
  const href           = options.href         || '/';

  // Return HTML code:
  return `
  <!----------------------------------------------->
  
  <svg xmlns="http://www.w3.org/2000/svg" class="d-none">
    <symbol id="arrow-right-circle" viewBox="0 0 16 16">
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
    </symbol>
  </svg>

  <header class="d-flex align-items-center pb-3 mb-5 border-bottom">
    <a href="${href}" class="d-flex align-items-center text-body-emphasis text-decoration-none">
      
      ${displayLogo ? 
      `<img class="bi me-3" width="40" height="40" src="/public/images/logo.png" style="filter: drop-shadow(0px 0px 1px black);">
      </img>`
      : ''}

      <span class="fs-4">${headingText}</span>
    </a>
  </header>
  
  <!----------------------------------------------->
  `;
};
