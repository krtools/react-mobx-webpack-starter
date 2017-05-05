// fixes async loaders with relative path config because they use script tags
// statically loaded imports work out of the box regardless of publicPath, so that can
// stay blank at compile time; this is only needed for require.ensure
// eslint-disable-next-line no-undef
__webpack_public_path__ = `${document.URL.slice(0, document.URL.lastIndexOf('/'))}/assets/`;