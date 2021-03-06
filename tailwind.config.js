module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
    },
    extend: {
      strokeWidth: {
        1.5: '1.5',
      },
    },
    fontFamily: {
      noto: 'Noto Sans',
    },
    theme: {
      backgroundSize: {
        auto: 'auto',
        cover: 'cover',
        contain: 'contain',
        250: '250px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
