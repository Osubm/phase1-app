import { SectionCard } from '../../components/SectionCard';

export function ProductionScreen() {
  return (
    <SectionCard title="Production batch" subtitle="Convert raw ingredients into saleable stock and record yield loss.">
      <div className="field-grid">
        <label className="field-label">Input ingredient<input value="Chicken 10kg" readOnly /></label>
        <label className="field-label">Output<input value="40 quarter portions" readOnly /></label>
        <label className="field-label">Waste<input value="0.5kg trim loss" readOnly /></label>
      </div>
      <div className="action-row"><button className="primary">Save batch</button></div>
    </SectionCard>
  );
}
