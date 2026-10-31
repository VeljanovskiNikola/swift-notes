import { Card } from "@/components/Card";
import { Icon, type IconName } from "@/components/Icon";

interface TopicCardProps {
  icon: IconName;
  title: string;
  description: string;
  index?: number;
}

export function TopicCard({ icon, title, description, index = 0 }: TopicCardProps) {
  return (
    <Card index={index} stagger={80} className="p-4">
      <h3 className="text-foreground mb-2 flex items-center gap-3 font-medium">
        <Icon name={icon} className="text-primary-soft shrink-0" />
        {title}
      </h3>
      <p className="text-muted text-sm">{description}</p>
    </Card>
  );
}
