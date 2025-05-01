export interface Translations {
    languageLabel: string;
    languageOptions: {
      en: string;
      es: string;
    };
    index: {
      title: string;
      email: string;
      portfolio: string;
    };
    portfolio: {
      title: string;
      header: {
        nav: {
            about_me: string;
            minecraft_proyects: string;
            resources: string;
            other_proyects: string;
            contact: string;
        };
      };
      hero: {
        title: string;
        badge: string;
        summary: string;
      };
      about: {
        title: string;
        content: {
          title: string;
          summary_1: string;
          summary_2: string;
        };
        technologies: {
          title: string;
          studying: string;
        };
      };
      minecraft_proyects: {
        title: string;
        proyects: {
          party_fest: {
            title: string;
            description: string;
          };
          the_8_show: {
            title: string;
            description: string;
          };
          pumpkin_challenge: {
            title: string;
            description: string;
          };
          speedrun_boss: {
            title: string;
            description: string;
          };
        };
      };
      resources: {
        title: string;
        resources: {
          xwhitelist: {
            title: string;
            description: string;
          };
          xteams: {
            title: string;
            description: string;
          };
          xutils: {
            title: string;
            description: string;
          };
          dwhitelist: {
            title: string;
            description: string;
          };
          lteams: {
            title: string;
            description: string;
          };
        };
      };
      other_proyects: {
        title: string;
        proyects: {
          drygo_dev: {
            title: string;
            description: string;
          };
          portfolio: {
            title: string;
            description: string;
          };
        };
      };
      contact: {
        title: string;
        button_mail: string;
      };
      footer: {
        copyright: string;
        buttons: {
          about: string;
          top: string;
        };
      };
      toast: {
        mail: string;
        discord: string;
      };
    };
  }
  