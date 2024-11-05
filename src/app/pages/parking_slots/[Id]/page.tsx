interface Params {
  Id: string;
}

export default function Info({ params }: { params: Params }) {
  return (
    <div>
      <p>teste {params.Id}</p>
    </div>
  );
}
