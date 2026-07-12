import Card from "../../../../components/Card/Card";
import "./StatsCard.css";

function StatsCard({ icon: Icon, label, value, tone = "blue" }) {
  return (
    <Card className="stats-card">
      <div className={`stats-card__icon stats-card__icon--${tone}`}>
        <Icon />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </Card>
  );
}

export default StatsCard;
