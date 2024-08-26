var socialNameSpace = (function () {
  const text = {
    EN: "By using the energy dashboard tool, created by Eurostat, you can easily visualise the evolution of the most important energy indicators (energy efficiency, share of renewables, import dependency and many more) for your country and for the EU.",
    FR: "En utilisant l'outil de tableau de bord énergétique, créé par Eurostat, vous pouvez facilement visualiser l'évolution des indicateurs énergétiques les plus importants (efficacité énergétique, part des énergies renouvelables, dépendance aux importations, et bien d'autres) pour votre pays et pour l'UE.",
    DE: "Mit dem Energiedashboard-Tool, das von Eurostat erstellt wurde, können Sie die Entwicklung der wichtigsten Energieindikatoren (Energieeffizienz, Anteil erneuerbarer Energien, Importabhängigkeit und viele mehr) für Ihr Land und für die EU leicht visualisieren."
    };

  const currentUrl = encodeURIComponent(window.location.href);
  const language = (REF.language || 'EN').toUpperCase(); // Default to English and ensure uppercase

  function openWindow(url, height = 450, width = 650) {
    window.open(url, "", `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=${height},width=${width}`);
  }

  return {
    linkedin: function () {
      const description = encodeURIComponent(text[language]);
      const url = `https://www.linkedin.com/shareArticle?mini=true&title=Energydashboard&summary=${description}&url=${currentUrl}`;
      openWindow(url);
      return false;
    },

    twitter: function () {
      const textContent = encodeURIComponent(text[language]);
      const url = `https://twitter.com/share?text=${textContent}&url=${currentUrl}`;
      openWindow(url, 400, 700);
      return false;
    },

    facebook: function () {
      const description = encodeURIComponent(text[language]);
      const url = `https://www.facebook.com/sharer.php?u=${currentUrl}&quote=${description}`;
      openWindow(url, 500, 700);
      return false;
    },

    email: function () {
      const subject = encodeURIComponent("Energy dashboard");
      const body = encodeURIComponent(`${text[language]} ${window.location.href}`);
      document.location = `mailto:ESTAT-ENERGY@ec.europa.eu?subject=${subject}&body=${body}`;
    },
  };
})();