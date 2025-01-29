import Markdoc from "@markdoc/markdoc";

export default function TestPage() {
  const source = "# Markdoc";

  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast /* config */);

  const html = Markdoc.renderers.html(content);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Source:</h2>
        <pre className="bg-gray-100 p-2 rounded">{source}</pre>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Rendered:</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
