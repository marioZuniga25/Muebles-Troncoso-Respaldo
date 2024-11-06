import React from 'react';
import ReactDOM from 'react-dom/client';
import Ofertas from './componets/OrfertasComponent';
import reactToWebComponent from 'react-to-webcomponent';

// Convertir el componente de React a un Web Component
const OfertasWebComponent = reactToWebComponent(Ofertas, React, ReactDOM);

// Registrar el Web Component
customElements.define('ofertas-component', OfertasWebComponent);