import { useEffect, useState } from 'react';
import PromocionesService from '../services/PromocionesService'; 
import '../css/Ofertas.css';
import 'animate.css';
import { FaBolt } from 'react-icons/fa';
const Ofertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promocionesData = await PromocionesService.getPromocionesRandom();
        const productosData = await PromocionesService.getProductos();

        const ahora = new Date();
        const promocionesActivas = promocionesData.filter(promocion => {
          const fechaFin = new Date(promocion.fechaFin);
          return fechaFin > ahora;
        });

        const ultimaPromocion = promocionesActivas.length > 0 ? promocionesActivas[promocionesActivas.length - 1] : null;

        if (ultimaPromocion) {
          const productosEnPromocion = ultimaPromocion.productos.map(productoId => {
            const producto = productosData.find(p => p.idProducto === productoId);
            const descuento = Math.floor(Math.random() * 11) + 10; // Descuento entre 10% y 20%
            const precioConDescuento = (producto.precio * (1 - descuento / 100)).toFixed(2);
            return {
              ...producto,
              descuento,
              precioConDescuento
            };
          });
          setOfertas({ ...ultimaPromocion, productos: productosEnPromocion });

          const tiempoRestante = Math.floor((new Date(ultimaPromocion.fechaFin) - ahora) / 1000);
          setCountdown(tiempoRestante);
          setProgress((tiempoRestante * 100) / 3600); // Suponiendo una duración de 1 hora (3600 segundos)
        }
      } catch (error) {
        console.error('Error fetching ofertas:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setCountdown(prev => {
        if (prev > 0) {
          setProgress(((prev - 1) * 100) / 3600);
          return prev - 1;
        }
        clearInterval(intervalId);
        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h} hr ${m} min ${s} sec`;
  };

  // Nueva función para emitir el evento
  const handleProductClick = (producto) => {
    const event = new CustomEvent('productoSeleccionado', {
      detail: {
        idProducto: producto.idProducto,
        precioConDescuento: producto.precioConDescuento,
        descuento: producto.descuento
      },
      bubbles: true,
      cancelable: true,
      composed: true
    });
    window.dispatchEvent(event); // Emite el evento
  };

  return (
    <div className="ofertasContainer">
       <h2 className="title animate__animated animate__flash">
        <FaBolt className="icon animate__animated animate__bounce animate__infinite" />
        Ofertas Relámpago
      </h2>
      {ofertas && ofertas.productos && ofertas.productos.length > 0 ? (
        <div className="banner">
          <div key={ofertas.idPromocionRandom} className="productList">
            {ofertas.productos.map(producto => (
              <div 
                key={producto.idProducto} 
                className="productCard" 
                onClick={() => handleProductClick(producto)}
              >
                {/* Badge de descuento */}
                <div className="discountBadge">-{producto.descuento}%</div>
                
                <img 
                  src={producto.imagen} 
                  alt={producto.nombreProducto} 
                  className="productImage" 
                />
                <div className="productName">{producto.nombreProducto}</div>
                
                {/* Precio original tachado */}
                <div className="productPrice">
                  <span className="strikethrough">${producto.precio}</span>
                </div>
                
                {/* Precio con descuento */}
                <div className="productDiscount">
                  MNX: ${producto.precioConDescuento} 
                </div>
                
                <div className="countdown">
                  Quedan: {formatTime(countdown)}
                </div>
                
                <div className="progressLoader">
                  <div className="progress" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No hay ofertas disponibles.</p>
      )}
    </div>
  );
  
};

export default Ofertas;
