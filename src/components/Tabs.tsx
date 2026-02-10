import React, { useState, ReactNode } from 'react';
import "../assets/sass/components/tabs-custom.scss"

// Definición de tipos
interface TabProps {
  title: string;
  children: ReactNode;
}

interface TabsProps {
  children: ReactNode;
}

interface ContentProps {
  children: ReactNode;
}

// Componente Tabs
const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const toggleTab = (index: number) => setActiveTab(index)

  return (
    <div className='d-flex flex-column align-content-center'>
      <div className="container">
        <div className="bloc-tabs">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement<TabProps>(child)) {
              return (
                <button
                  type='button'
                  className={activeTab === index ? "tabs active-tab" : "tabs"}
                  onClick={() => toggleTab(index)}
                >
                  <span>{child.props.title}</span>
                </button>
              );
            }
            return null;
          })}
        </div>
        <div className="content-tabs">
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement<TabProps>(child)) {
              return (
                <div
                  className={activeTab === index ? "tab-content active-content" : "tab-content"}
                >
                  {child.props.children}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

// Componente Tab
const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

//Componente Content
const Content: React.FC<ContentProps> = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab, Content };
