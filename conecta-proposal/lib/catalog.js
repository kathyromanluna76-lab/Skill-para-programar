// Datos base de la aplicación, portados del prototipo (conecta-proposal.html).
// Se importa tanto desde el cliente (pantalla) como desde el servidor (generación con IA).

export const SERVICIOS = ["Diagnóstico de Supply Chain","S&OP / IBP","Planeamiento de demanda","Gestión de inventarios",
"Compras y abastecimiento","Optimización de almacenes","Centros de distribución","Distribución y transporte",
"Rediseño de procesos","Selección o implementación de ERP / WMS","Transformación de operaciones",
"Diseño de KPIs","Capacitación o talleres","Otro"];

export const LIB = {
  "Optimización de almacenes": {
    tesis:"Antes de invertir en un WMS o en automatización, el almacén necesita procesos estandarizados y ubicaciones confiables. Si automatizamos una operación desordenada, solo vamos a acelerar los errores.",
    metodologia:"El trabajo se realiza en terreno, dentro del almacén y con el equipo que opera todos los días. Partimos de una línea base medida, no estimada: capacidad teórica frente a capacidad efectiva, perfil de inventario ABC, tiempos de ciclo, mapa de recorridos y contraste entre lo que registra el sistema y lo que existe físicamente. Sobre esa base construimos el blueprint del modelo operativo, los criterios de slotting y la estructura organizacional que lo sostiene. Identificamos quick wins desde las primeras semanas, de modo que la operación empiece a mejorar durante la consultoría y no solo al final.",
    preguntas:"¿Cuál es la capacidad real de nuestro almacén frente a la capacidad teórica?\n¿Por qué el sistema no coincide con lo que encontramos en el piso?\n¿Cuánto nos cuesta hoy preparar y despachar un pedido?\n¿Dónde se pierde el tiempo en la preparación de pedidos?\n¿Estamos preparados para implementar un WMS?",
    fases:[
      {n:"Diagnóstico operativo y línea base",s:3,a:"Levantamiento de procesos de recepción, almacenamiento, preparación y despacho\nObservación directa en el almacén y medición de tiempos de ciclo\nCapacidad teórica frente a capacidad efectiva y perfil de inventario ABC\nContraste entre ubicaciones del sistema y ubicaciones físicas\nProductividad, dotación y estructura organizacional actual",e:"Diagnóstico operativo, línea base de indicadores y matriz de problemas, causas e impactos"},
      {n:"Diseño del modelo operativo",s:3,a:"Blueprint de recepción, almacenamiento, picking y despacho\nCriterios de slotting y propuesta de layout\nDefinición de estructura organizacional y matrices RACI\nDiseño del cuadro de indicadores de almacén\nIdentificación e implementación de quick wins",e:"Blueprint del modelo operativo, layout, criterios de slotting, RACI y cuadro de KPIs"},
      {n:"Implementación inicial y preparación tecnológica",s:2,a:"Documentación de procedimientos y políticas\nMapeo físico de ubicaciones y regularización\nCapacitación al equipo del almacén\nRequerimientos funcionales para WMS, códigos de barras y lectores",e:"Manual de procedimientos, mapa físico de ubicaciones y roadmap de implementación"}],
    entregables:"Diagnóstico operativo detallado y línea base de indicadores\nMatriz de problemas, causas e impactos\nBlueprint del modelo operativo del centro de distribución\nPropuesta de layout y criterios de slotting\nEstructura organizacional propuesta y matrices RACI\nManual de procedimientos y políticas de almacén\nCuadro de indicadores de gestión\nRoadmap de implementación y requerimientos para WMS",
    beneficios:"Mayor utilización de la capacidad instalada y postergación de inversiones en metros cuadrados\nConfiabilidad de inventario e información exacta entre sistema y operación física\nReducción de tiempos de preparación y despacho, con impacto directo en nivel de servicio\nTrazabilidad de materiales y productos a lo largo de toda la operación\nMenor dependencia del conocimiento individual del personal\nBase operativa sólida antes de comprometer la inversión en WMS o automatización"},
  "S&OP / IBP": {
    tesis:"El ERP no planifica por sí solo. Sin procesos integrados, datos maestros confiables y gobierno de la demanda, ninguna herramienta va a ordenar el planeamiento.",
    metodologia:"Evaluamos la madurez del planeamiento integrado en siete dimensiones: gobernanza y organización, planeamiento de demanda, planeamiento de producción, compras y abastecimiento, inventarios, distribución y preparación del sistema. Cada dimensión se califica en una escala de 1 a 5, desde una operación reactiva hasta un planeamiento colaborativo y optimizado, lo que permite construir un mapa de madurez organizacional y priorizar las brechas por impacto. El trabajo combina entrevistas con las gerencias involucradas, revisión de datos maestros y parámetros, y análisis del proceso real de toma de decisiones, no del proceso documentado.",
    preguntas:"¿Qué tan confiable es nuestro forecast?\n¿Quién es dueño de la demanda?\n¿Cómo se toman hoy las decisiones cuando el plan no se puede cumplir?\n¿Tenemos capacidad para cumplir el plan y dónde están los cuellos de botella?\n¿Tenemos sobrestock o riesgo de quiebres?\n¿Está el sistema correctamente parametrizado y qué información falta?",
    fases:[
      {n:"Kick off y levantamiento",s:1,a:"Reunión de arranque y alineamiento de alcance\nEntrevistas con Gerencia General, Finanzas, Tecnología, Comercial y Operaciones\nRecopilación de información y definición del plan de trabajo",e:"Plan de trabajo validado y mapa de actores"},
      {n:"Análisis de procesos",s:1,a:"Levantamiento del proceso actual de demanda, producción, compras e inventarios\nIdentificación de roles, responsabilidades y puntos de decisión\nEvaluación de gobernanza y escalamiento",e:"Mapa del proceso actual y hallazgos por dimensión"},
      {n:"Análisis de datos y sistema",s:1,a:"Revisión de exactitud de forecast y comportamiento de inventarios\nEvaluación de datos maestros: productos, clientes, proveedores y listas de materiales\nRevisión de parámetros: lead times, lotes mínimos, stock de seguridad y punto de reorden",e:"Assessment de datos maestros y parametrización"},
      {n:"Diseño del modelo futuro",s:1,a:"Construcción del mapa de madurez por dimensión\nDiseño del modelo objetivo de planeamiento integrado\nHoja de ruta hacia S&OP y validación con la organización\nPresentación ejecutiva de resultados",e:"Blueprint de planeamiento integrado y hoja de ruta"}],
    entregables:"Informe ejecutivo con situación actual y hallazgos\nAssessment de madurez con nivel de desarrollo por dimensión\nAssessment de preparación del sistema, parametrización y datos maestros\nMatriz de brechas de procesos, datos, personas y tecnología\nBlueprint de planeamiento integrado con el modelo objetivo\nHoja de ruta hacia S&OP con riesgos identificados",
    beneficios:"Mayor precisión del forecast y una única versión de la demanda para toda la organización\nReducción de sobrestock y obsolescencia, con impacto en capital de trabajo\nMayor estabilidad del plan de producción y menos reprogramaciones\nAnticipación de requerimientos de compra y menor compra de emergencia\nParametrización del sistema alineada al negocio y no al revés\nDecisiones gerenciales tomadas en un solo foro y con la misma información"},
  "Rediseño de procesos": {
    tesis:"Si automatizamos un proceso ineficiente, solo vamos a acelerar los errores. Primero la base operativa: procesos estandarizados, roles definidos e información confiable. Después la tecnología.",
    metodologia:"Trabajamos sobre el proceso real, no sobre el que está documentado. La intervención combina entrevistas a profundidad, observación directa en planta y almacenes, revisión del sistema actual y de los archivos paralelos en Excel, y análisis de flujos, inventarios y layout físico. Separamos síntomas de causas raíz antes de proponer cambios, y priorizamos el rediseño por impacto en el negocio y facilidad de implementación. El resultado es un modelo operativo con dueños claros, puntos de control definidos e indicadores que permiten gestionar, y recién sobre esa base se traducen los requerimientos técnicos para la inversión tecnológica.",
    preguntas:"¿Por qué la información no coincide entre áreas?\n¿Quién es responsable de cada parte del proceso?\n¿Cuántos registros paralelos estamos manteniendo y qué nos cuestan?\n¿Dónde se generan los retrabajos y las diferencias de inventario?\n¿Qué necesitamos ordenar antes de implementar un nuevo ERP?",
    fases:[
      {n:"Diagnóstico integral",s:3,a:"Entrevistas a profundidad con las áreas involucradas\nObservación directa en planta, almacenes y despachos\nRevisión del sistema actual y de las hojas de cálculo paralelas\nAnálisis de flujos, inventarios y layout físico\nAnálisis de causas raíz",e:"Diagnóstico ejecutivo, mapa de procesos AS IS e identificación de quick wins"},
      {n:"Diseño del modelo operativo",s:3,a:"Rediseño de extremo a extremo del proceso objetivo\nDefinición de dueños de proceso y puntos de control\nElaboración de matrices RACI\nDiseño de interfaces entre áreas e indicadores de gestión",e:"Mapa TO BE, manual de procedimientos, matrices RACI y cuadro de KPIs"},
      {n:"Roadmap de transformación",s:2,a:"Traducción de los procesos diseñados en requerimientos funcionales\nPriorización de iniciativas y cronograma de implementación\nRecomendaciones sobre ERP, códigos de barras, lectores, etiquetas y tableros",e:"Plan de implementación priorizado y requerimientos funcionales"}],
    entregables:"Diagnóstico ejecutivo detallado\nMapa integral de procesos AS IS\nModelo operativo TO BE con flujos optimizados\nManual de procesos y políticas\nMatrices RACI con responsabilidades definidas\nCuadro de indicadores de gestión\nRoadmap de transformación con requerimientos funcionales",
    beneficios:"Eliminación de registros paralelos y una sola fuente de información entre áreas\nConfiabilidad de inventario e información exacta entre sistemas y movimientos físicos\nTrazabilidad completa de materiales y productos\nReducción de tiempos administrativos con responsabilidades claramente definidas\nIndicadores confiables para la toma de decisiones gerenciales\nRequerimientos técnicos precisos antes de comprometer una inversión en ERP o WMS"}
};

export const DEF_SET = {
  firma:"Conecta Consulting", ruc:"20603665881", web:"", email:"", tel:"",
  tagline:"Tu conexión al éxito empresarial",
  quienes:"Conecta Consulting nace de la búsqueda de la mejora continua en los procesos de gestión estratégica y operativa. Estamos dirigidos por profesionales con visión estratégica que han transformado operaciones logísticas en las principales empresas del país, y combinamos rigor estratégico con excelencia operativa para convertir la cadena de suministro en una ventaja competitiva.",
  clientes:"Heineken, Ransa, Tottus, Roxfarma, FAM Logistics Cargo, Marco, Naltech, Mahibe, Proyecta, Andes Outdoors, Electroenchufe",
  facturacion:"Conecta Consultores. RUC: 20603665881\nBanco Interbank soles: 2003004091580\nCCI: 00320000300409158030",
  condiciones:"Para iniciar con el servicio se factura el primer hito, a pagar en un máximo de 7 días.\nPara iniciar cada fase se factura el avance según lo descrito en la presente propuesta.\nToda la documentación elaborada será entregada en formato digital por etapas, según el término de cada fase.\nLa propuesta incluye estricta confidencialidad sobre la información a la que se acceda durante el proyecto.\nLos honorarios no incluyen gastos de viaje, alojamiento ni movilidad fuera de Lima, los que serán coordinados previamente con el cliente.",
  supuestos:"El cliente designará una contraparte responsable del proyecto con capacidad de decisión.\nEl cliente facilitará el acceso a la información, sistemas e instalaciones necesarios dentro de los plazos acordados.\nLa disponibilidad del personal clave para entrevistas, visitas y talleres será coordinada al inicio del proyecto.\nLos plazos indicados podrán ajustarse si la información requerida no está disponible en las fechas acordadas."
};

export const REF = "Referencias internas de calibración: diagnóstico de 4 semanas S/ 12,000; transformación logística de 8 semanas S/ 48,000; estrategia de red logística de 12 semanas S/ 45,000. No salen en el documento.";

export const SEC = [
  {k:"tesis", t:"La idea que sostiene esta propuesta", quote:true},
  {k:"contexto", t:"Contexto y situación actual"},
  {k:"problema", t:"El desafío actual"},
  {k:"preguntas", t:"Preguntas que responderá el proyecto"},
  {k:"objetivo", t:"Objetivo del proyecto"},
  {k:"alcance",  t:"Alcance del servicio"},
  {k:"metodologia", t:"Metodología de trabajo"},
  {k:"beneficios", t:"Beneficios esperados"},
  {k:"cierre", t:"Cierre"}
];
