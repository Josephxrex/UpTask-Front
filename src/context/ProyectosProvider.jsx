import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clienteAxios("/proyectos", config);
        //console.log(data);
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };

    obtenerProyectos();
  }, []);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };

  const submitProyecto = async (proyecto) => {
    console.log(proyecto);
    if (proyecto.id) {
     await editarProyecto(proyecto);
    } else {
      await nuevoProyecto(proyecto);
    }
  };

  const editarProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );
      //console.log(data)

      //Sincronizar el state
      const proyectosActualizados = proyectos.map((ProyectoState) =>
        ProyectoState._id === data._id ? data : ProyectoState
      );
      setProyectos(proyectosActualizados);
      //Mostrar la alerta
      setAlerta({
        msg: "Proyecto Actualizado Correctamente",
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
    //Redireccionar

  };
  const nuevoProyecto = async (proyecto) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      //console.log(data);
      setProyectos([...proyectos, data]);
      setAlerta({
        msg: "Proyecto Creado Correctamente",
        error: false,
      });
      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerProyecto = async (id) => {
    //console.log(id);
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      //console.log(data)
      setProyecto(data);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};
export { ProyectosProvider };

export default ProyectosContext;
