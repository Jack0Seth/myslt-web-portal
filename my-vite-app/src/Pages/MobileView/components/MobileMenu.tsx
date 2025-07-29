import React from 'react';
import './MobileContentSection.css';

interface MobileMenuProps {
  items: {
    id: string;
    name: string;
    disabled?: boolean;
  }[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  items, 
  activeItem, 
  onItemClick 
}) => {
  return (
    <div className="mobile-menu-row">
      {items.map((item) => (
        <div
          key={item.id}
          className={`mobile-menu-item ${activeItem === item.id ? 'active' : ''} ${item.disabled ? 'disabled' : ''}`}
          onClick={() => onItemClick(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};