import { Config } from "@markdoc/markdoc";

const config: Config = {
  nodes: {
    paragraph: {
      render: "Paragraph",
    },
    heading: {
      render: "Heading",
      attributes: {
        level: { type: String },
      },
    },
  },
  tags: {
    callout: {
      render: "Callout",
      attributes: {
        title: {
          type: String,
          default: "default title",
        },
      },
    },
  },
};

const components = {
  Paragraph: ({ children }: any) => {
    return <div className="text-base pb-2">{children}</div>;
  },
};

export { config, components };
