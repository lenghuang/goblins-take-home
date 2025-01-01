import { LabelledCrops } from '../domain/csv/LabelledCrops';
import { Container } from '../shared/Container';
import { Head } from '../shared/Head';

export default function ViewLabelsPage() {
  return (
    <>
      <Head title="Download" />
      <Container>
        <LabelledCrops />
      </Container>
    </>
  );
}
