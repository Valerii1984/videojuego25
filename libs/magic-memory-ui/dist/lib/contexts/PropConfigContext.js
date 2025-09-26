import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const PropConfigContext = createContext(null);
export const PropConfigProvider = ({ value, children }) => {
    return (_jsx(PropConfigContext.Provider, { value: value, children: children }));
};
export const usePropConfig = () => useContext(PropConfigContext);
