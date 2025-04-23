///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// => How to map a component:                            // MEANING:
//
//     {
//       placeholder: "<!-- anotherComponent -->",       => how you call the component from any `.html` under `/_pages`
//       dataFile: "anotherData.json",                   => the component's `.json` data under `/_data`
//       component: "anotherComponent.js"                => the component's `.js` file under `/_components`
//     },
//
//
// => If your component requires no data or have default values, set it like this: 
//
//     {
//       placeholder: "<!-- homeHead -->",       
//       dataFile: "",                                   => set `dataFile` with an empty string
//       component: "/head/home.js"                
//     },
//
// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = [
    {
      placeholder: "<!-- homeHead -->",
      dataFile: "",
      component: "/head/home.js"
    },

    {
      placeholder: "<!-- bsThemeChanger -->",
      dataFile: "",
      component: "bsThemeChanger.js"
    },

    {
      placeholder: "<!-- footerSection -->",
      dataFile: "",
      component: "footerSection.js"
    },

    {
      placeholder: "<!-- home_headerSection -->",
      dataFile: "home_headerSection.json",
      component: "headerSection.js"
    },

    {
      placeholder: "<!-- home_textSection_1 -->",
      dataFile: "home_textSection_1.json",
      component: "textSection.js"
    },

    {
      placeholder: "<!-- home_textSection_2 -->",
      dataFile: "home_textSection_2.json",
      component: "textSection.js"
    }
]
  