import React from 'react';
import esquemaBase from '../assets/img/esquemaBase.jpg';
import techs from '../assets/img/techs.png';
import './about.css';

const About = () => {
  const sections = [
    {
      title: '¿De qué trata el proyecto?',
      text: `MotoManWeb es una aplicación web que permite gestionar inventario, ventas y facturación de una tienda especializada en artículos para motociclismo "MotoMan". Está diseñado para facilitar las operaciones del negocio en tiempo real desde una interfaz simple y funcional.`,
      imgAlt: 'Imagen ilustrativa del sistema funcionando',
      imgSrc: 'https://th.bing.com/th/id/OIP.ZYTmbcM9U4hnC3DFJVz__QHaHi?w=178&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      reverse: false
    },
    {
      title: '¿Cómo surgió la idea?',
      text: `La idea nace de observar negocios que aún dependen de métodos manuales como hojas sueltas y cuadernos para manejar su inventario. Esto provoca errores, pérdidas o ventas sin stock disponible. MotoManWeb surge como una solución accesible y personalizada para cubrir esas deficiencias.`,
      imgAlt: 'Esquema de idea original',
      imgSrc: esquemaBase,
      reverse: true
    },
    {
      title: '¿Qué problema resuelve?',
      text: `Evita errores de inventario, mejora la precisión en las ventas y ofrece reportes claros que ayudan a tomar decisiones informadas. El sistema también permite ver alertas por productos bajos en stock, controlar proveedores y automatizar tareas repetitivas.`,
      imgAlt: 'Esquema de problemas comunes',
      imgSrc: 'https://th.bing.com/th/id/OIP.CFVOSlARu2eLpXo8QcX26AHaHL?w=180&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      reverse: false
    },
    {
      title: 'Tecnologías utilizadas',
      text: `Frontend: React, Bootstrap, React Router
Backend: Python, Flask
Base de datos: PostgreSQL, MySQL
ORM: SQLAlchemy
Extras: Axios, autenticación con JWT`,
      imgAlt: 'Esquema tecnológico del sistema',
      imgSrc: techs,
      reverse: true
    }
  ];

  return (
    <div style={{ background: '#1e1e2f', minHeight: '100vh', padding: '50px 0' }}>
      <div className="container">
        <h1 className="text-center mb-5 display-5 fw-bold text-light">
          Sobre el Proyecto: <span className="text-info">MotoManWeb</span>
        </h1>

        {sections.map((section, index) => (
          <div
            key={index}
            className={`row align-items-center mb-5 ${
              section.reverse ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="col-md-6" data-aos="fade-up">
              <div
                className="p-4 rounded shadow"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#e0e0e0',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <h4 className="fw-semibold mb-3">{section.title}</h4>
                {section.title === 'Tecnologías utilizadas' ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: section.text.replace(/\n/g, '<br/>')
                    }}
                  />
                ) : (
                  <p>{section.text}</p>
                )}
              </div>
            </div>
            <div className="col-md-6 text-center" data-aos="fade-up">
              <img
                src={section.imgSrc}
                alt={section.imgAlt}
                className="img-fluid rounded shadow"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
          </div>
        ))}

        {/* Última sección: sobre el autor */}
        <div
          className="rounded shadow-lg text-center mx-auto p-5"
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#f0f0f0',
            maxWidth: '900px',
            backdropFilter: 'blur(4px)'
          }}
          data-aos="fade-up"
        >
          <h4 className="mb-3 text-light">Copyright</h4>
          <p>
            Este proyecto fue diseñado y desarrollado por Salvador Largaespada. Aunque es un esfuerzo individual, se ha intentado abarcar una arquitectura sólida que refleje aprendizajes técnicos y de experiencia de usuario obtenidos a lo largo del curso.
          </p>
          <p>
            Muchas gracias por revisar este proyecto!
          </p>
        </div>

        <div className="text-end mt-5">
          <button className="btn btn-outline-light" onClick={() => window.history.back()}>
            ← Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
