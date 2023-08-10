import Button from "../Button/Button";
import mc from "./smallModale.module.scss";

export const SmallModale = ({ isPoped, onClose, children, position }) => {
  if (!isPoped) return null;
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };
  return (
    <div className={`${mc.smallModale}`} style={style}>
      {children}
      <Button message={`Valider`} onClick={onClose} />
    </div>
  );
};
