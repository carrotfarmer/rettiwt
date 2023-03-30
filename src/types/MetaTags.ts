export interface MetaTags {
  props: {
    openGraphData: (
      | {
          property: string;
          content: string;
          key: string;
        }
      | {
          property: string;
          content: {
            title: string;
            description?: undefined;
          };
          key: string;
        }
      | {
          property: string;
          content: {
            description: string;
            title?: undefined;
          };
          key: string;
        }
    )[];
  };
}
