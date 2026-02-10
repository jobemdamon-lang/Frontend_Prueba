import React, { createContext, useContext, FC, ReactNode } from "react";

interface IElements {
    activeTab: number | string,
    setActiveTab: (idx: string | number) => void,
    children: ReactNode
}

type IElement = {
    titleTab: string,
    idTab: string | number,
    children: ReactNode
}

// Crear un contexto para el activeTab
const ActiveTabContext = createContext<{ activeTab: number | string } | undefined>(undefined);

const TabContainer: FC<IElements> = ({ activeTab, setActiveTab, children }) => {
    return (
        <ActiveTabContext.Provider value={{ activeTab }}>
            <div>
                <ul className="nav nav-tabs nav-line-tabs fs-6">
                    {React.Children.map(children, (child) => {
                        if (!React.isValidElement(child)) return null;
                        const { titleTab, idTab } = child.props as IElement;
                        return (
                            <li className="nav-item" key={idTab}>
                                <a
                                    className={`nav-link fs-6 text-uppercase`}
                                    data-bs-toggle="tab"
                                    href={`#kt_tab_pane_${idTab}`}
                                    onClick={() => setActiveTab(idTab)}
                                >
                                    {titleTab}
                                </a>
                            </li>
                        );
                    })}
                </ul>
                <div className="tab-content d-block">
                    {React.Children.map(children, (child) => {
                        if (!React.isValidElement(child)) return null;
                        return child;
                    })}
                </div>
            </div>
        </ActiveTabContext.Provider>
    );
};

const TabItem: FC<IElement> = ({ children, idTab }) => {
    const { activeTab } = useContext(ActiveTabContext) || { activeTab: null };
    return (
        <div
            className={`tab-pane fade ${activeTab === idTab ? "show active" : ""}`}
            id={`kt_tab_pane_${idTab}`}
            role="tabpanel"
            key={idTab}
        >
            {children}
        </div>
    );
};

export { TabContainer, TabItem };
