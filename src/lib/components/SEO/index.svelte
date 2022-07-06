<script>
  export let lang = 'en'
  export let pageTitle
  export let faviconPngUrl
  export let faviconIcoUrl
  export let siteUrl

  export let shareTitle
  export let description
  export let shareImgUrl
  export let shareImgAltText

  export let ogLocale = 'en_GB'
  export let ogLocaleAlt = 'en_US'
</script>

<svelte:head>
  <html lang={lang}></html>
  <title>{pageTitle}</title>
  <link rel="icon" type="image/png" href={faviconPngUrl} />
  <link rel="shortcut icon" type="image/x-icon" href={faviconIcoUrl} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  
  <meta property="og:url" content={siteUrl} />
  <meta property="og:title" content={shareTitle} itemprop="name" />
  <meta property="og:description" content={description} itemprop="description" />
  <meta property="og:image" content={shareImgUrl} itemprop="image" />
  <meta property="og:image:alt" content={shareImgAltText} />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:locale:alternate" content={ogLocaleAlt} />

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@DeaBankova">
  <meta name="twitter:creator" content="@DeaBankova">
  <meta name="twitter:title" content={shareTitle}>
  <meta name="twitter:description" content={description}>
  <meta name="twitter:image:src" content={shareImgUrl}>
  <meta name="twitter:image:alt" content={shareImgAltText}>
  
  
</svelte:head>