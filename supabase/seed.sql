-- ============================================
-- StoneMaps - Seed Data con EMPRESAS REALES
-- Solo para desarrollo local
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================

SET session_replication_role = replica;

-- ============================================
-- CANTEROS (Quarries)
-- ============================================
INSERT INTO profiles (id, email, company_name, role, subscription, description, phone, website, country, city, latitude, longitude) VALUES
  -- ITALIA
  ('00000000-0000-0000-0000-000000000001', 'info@henraux.it', 'Henraux S.p.A.', 'cantero', 'premium', 'Una de las canteras más antiguas de Carrara, activa desde el Renacimiento. Canteras propias en los Alpes Apuanos. Especialistas en Bianco Carrara, Statuario, Calacatta y Arabescato. Proveedores de los grandes proyectos de arte y arquitectura del mundo.', '+39 0584 7681', 'https://henraux.it', 'Italia', 'Querceta', 43.9700, 10.1700),
  ('00000000-0000-0000-0000-000000000002', 'info@franchiumbertomarmi.it', 'Franchi Umberto Marmi', 'cantero', 'premium', 'Líder en extracción y procesado de mármol de Carrara. Statuario, Calacatta, Bianco Carrara y Arabescato. Expositor habitual en Marmomac. Referente en mármol de alta gama.', '+39 0585 841000', 'https://franchiumbertomarmi.it', 'Italia', 'Carrara', 44.0800, 10.1000),
  ('00000000-0000-0000-0000-000000000003', 'info@margraf.it', 'Margraf S.p.A.', 'cantero', 'premium', 'Fundada en 1906 en Chiampo. Integra extracción y fabricación. Nembro Rosato, Botticino, Fior di Pesco, Perlato. Proyectos en los cinco continentes. Uno de los líderes italianos en mármol.', '+39 0444 475475', 'https://margraf.it', 'Italia', 'Chiampo', 45.5500, 11.2800),
  ('00000000-0000-0000-0000-000000000004', 'info@antolini.com', 'Antolini Luigi & C. S.p.A.', 'cantero', 'premium', 'Fundada en 1956 en Verona. Uno de los nombres más prestigiosos del sector mundial de la piedra natural. Acceso exclusivo a depósitos de mármoles, granitos, cuarcitas y ónix exóticos de todo el mundo.', '+39 045 6835555', 'https://antolini.com', 'Italia', 'Sega di Cavaion', 45.5300, 10.7700),
  ('00000000-0000-0000-0000-000000000005', 'info@toscomarmi.it', 'Gruppo Tosco Marmi', 'cantero', 'standard', 'Fundada en 1960. Propietarios de la única cantera de mármol Palissandro del mundo en Crevoladossola. También extraen Marmo Grigio y granitos. Proyectos de lujo residencial y hostelería.', '+39 0324 35000', 'https://toscomarmi.com', 'Italia', 'Crevoladossola', 46.1500, 8.3400),
  ('00000000-0000-0000-0000-000000000006', 'info@salvatori.it', 'Salvatori', 'cantero', 'standard', 'Fundada en 1946 por Guido Salvatori. Tercera generación. Venta en más de 100 países. Bianco Carrara, Crema d''Orcia, Pietra d''Avola. Conocidos por texturas innovadoras y diseño.', '+39 0584 7691', 'https://salvatori.it', 'Italia', 'Querceta', 43.9700, 10.1700),

  -- ESPAÑA
  ('00000000-0000-0000-0000-000000000010', 'info@levantina.com', 'Levantina y Asociados de Minerales S.A.', 'cantero', 'premium', 'Fundada en 1959. Mayor propietario de canteras de piedra natural del mundo. Extrae más de 2,2 millones de toneladas/año. 12+ canteras en España, Portugal y Brasil. Mayor productor mundial de Crema Marfil.', '+34 965 680 050', 'https://levantina.com', 'España', 'Novelda', 38.3848, -0.7680),
  ('00000000-0000-0000-0000-000000000011', 'info@bateig.com', 'Bateig Piedra Natural S.A.', 'cantero', 'standard', 'Fundada en 1878. Cantera y fábrica de piedra Bateig en Novelda. Bateig Blue, Bateig Cream, Bateig Azul, Bateig Verona. Cantera propia exclusiva en la provincia de Alicante.', '+34 965 600 312', 'https://bateig.com', 'España', 'Novelda', 38.3848, -0.7680),
  ('00000000-0000-0000-0000-000000000012', 'info@camar.es', 'Mármoles Camar S.L.', 'cantero', 'standard', 'Fundada en 1977 por José Sánchez. Empresa familiar con canteras propias en Macael. Blanco Macael, Gris Macael. Tradición marmolista almeriense.', '+34 950 128 000', NULL, 'España', 'Macael', 37.3300, -2.3000),
  ('00000000-0000-0000-0000-000000000013', 'info@arriagacanteras.es', 'Arriaga Canteras', 'cantero', 'basic', 'Canteras propias en Almería. Mármol Macael White, Grey, Yellow y Veined. Fábrica especializada en pulido, apomazado, abujardado y arenado.', '+34 950 128 100', NULL, 'España', 'Macael', 37.3300, -2.3000),
  ('00000000-0000-0000-0000-000000000014', 'info@granitoscabaleiro.com', 'Granitos Cabaleiro S.A.', 'cantero', 'standard', 'Fundada en los años 70. Más de 40 años extrayendo y comercializando granito. Rosa Porriño, Gris Mondariz, Gris Quintana. Fábrica en O Porriño.', '+34 986 330 500', 'https://granitoscabaleiro.com', 'España', 'O Porriño', 42.1600, -8.6200),
  ('00000000-0000-0000-0000-000000000015', 'info@cupagroup.com', 'Cupa Group', 'cantero', 'premium', 'Líder mundial en pizarra natural. 30 canteras, 40 plantas de procesado, 70 centros de distribución, 2.800 empleados. Presencia en 9 países. 79 filiales.', '+34 988 310 550', 'https://cupagroup.com', 'España', 'Carballeda de Valdeorras', 42.3900, -6.9800),
  ('00000000-0000-0000-0000-000000000016', 'info@granitosibericos.com', 'Granitos Ibéricos', 'cantero', 'standard', 'En activo desde 1964. Mayor productor de granito de España por volumen. Rosa Porriño y granitos gallegos. Polígono Industrial A Granxa, O Porriño.', '+34 986 331 000', NULL, 'España', 'O Porriño', 42.1600, -8.6200),

  -- TURQUÍA
  ('00000000-0000-0000-0000-000000000020', 'info@tureks.com', 'Tureks International Stone', 'cantero', 'premium', 'Fundada en 1982. Una de las empresas líderes de piedra natural de Turquía. Mármol turco, travertino, caliza y ónix. Suministro mundial.', '+90 248 233 2233', 'https://tureks.com.tr', 'Turquía', 'Burdur', 37.7200, 30.2900),
  ('00000000-0000-0000-0000-000000000021', 'info@adtmarble.com', 'ADT Marble', 'cantero', 'standard', 'Canteras y fábricas en Afyon, Antalya, Bilecik, Burdur, Bursa, Denizli, Isparta y Muğla. Exportación de bloques, tablas y baldosas.', '+90 212 465 0606', 'https://adtmarble.com', 'Turquía', 'Estambul', 41.0100, 28.9800),
  ('00000000-0000-0000-0000-000000000022', 'info@deltamarble.com', 'Delta Marble', 'cantero', 'standard', 'Gran empresa turca de mármol con fábrica en Burdur. Exportador habitual de mármol y travertino turco.', '+90 248 233 5050', 'https://deltamarble.com', 'Turquía', 'Burdur', 37.7200, 30.2900),

  -- BRASIL
  ('00000000-0000-0000-0000-000000000025', 'info@vitoriastonegroup.com', 'Vitória Stone Group', 'cantero', 'premium', 'Más de 36 años de experiencia. Uno de los mayores exportadores de piedra natural de Brasil. Extracción, procesamiento y exportación de granitos, cuarcitas y mármoles exóticos.', '+55 27 3261 0000', 'https://vitoriastonegroup.com', 'Brasil', 'Serra', -20.1300, -40.3100),
  ('00000000-0000-0000-0000-000000000026', 'info@magban.com.br', 'Magban', 'cantero', 'standard', 'Fundada en 1986. Produce y distribuye a más de 50 países. Entre los 10 mayores exportadores de piedra de Brasil. Mármol, granito y cuarcita brasileña.', '+55 28 3518 0000', 'https://magban.com.br', 'Brasil', 'Cachoeiro de Itapemirim', -20.8500, -41.1100),

  -- INDIA
  ('00000000-0000-0000-0000-000000000028', 'info@rkmarble.com', 'R K Marble Group', 'cantero', 'premium', 'Fundada en 1989. Líder en mármol y granito. Canteras en Rajastán (Morwad, Dharmeta, Dhariyawad, Banswara), Madhya Pradesh y Vietnam. Makrana White, mármoles indios.', '+91 1463 234 567', 'https://rkmarble.com', 'India', 'Kishangarh', 26.5900, 74.8600),
  ('00000000-0000-0000-0000-000000000029', 'info@bhandarimarble.com', 'Bhandari Marble Group', 'cantero', 'standard', 'Fabricante, mayorista y exportador líder de mármol indio, italiano, granito y piedra natural. Colección de las mejores canteras del mundo.', '+91 1463 235 000', 'https://bhandarimarble.com', 'India', 'Kishangarh', 26.5900, 74.8600),

  -- GRECIA
  ('00000000-0000-0000-0000-000000000030', 'info@stonegroup.gr', 'Stone Group International', 'cantero', 'premium', 'Integración vertical completa. 550+ empleados. 6 fábricas (Tesalónica, Thasos, Drama, Veria, Kavala). 8 canteras. Presencia en 80+ países. 250.000+ toneladas anuales. Thassos White, Volakas, Kavala.', '+30 2310 752 000', 'https://stonegroup.gr', 'Grecia', 'Tesalónica', 40.6300, 22.9400),
  ('00000000-0000-0000-0000-000000000031', 'info@topalidis.gr', 'Topalidis S.A.', 'cantero', 'standard', 'Canteras, procesamiento y suministro de mármol griego a todo el mundo. Thassos White, Drama White, Volakas. Ubicados en la famosa región de canteras de mármol blanco.', '+30 25210 60000', NULL, 'Grecia', 'Drama', 41.1500, 24.1500),

  -- PORTUGAL
  ('00000000-0000-0000-0000-000000000033', 'info@filstone.com', 'Filstone', 'cantero', 'standard', 'Proveedor de caliza Moca Cream y otras calizas portuguesas. Región de Alentejo. Piedra de Portugal para el mundo.', '+351 244 500 000', 'https://filstone.com', 'Portugal', 'Alcobaça', 39.5500, -8.9800),

  -- NORUEGA
  ('00000000-0000-0000-0000-000000000035', 'info@lundhs.no', 'Lundhs', 'cantero', 'premium', 'Fundada en 1962 por Thor Lundh. Mayor productor de piedra natural del norte de Europa. Blue Pearl, Emerald Pearl (larvikita). Solo se encuentra en Noruega. Cantera de Klaastad, una de las mayores de Europa.', '+47 33 12 64 00', 'https://lundhs.no', 'Noruega', 'Larvik', 59.0500, 10.0300),

  -- EGIPTO
  ('00000000-0000-0000-0000-000000000036', 'info@cidegypt.com', 'CID Egypt', 'cantero', 'basic', 'Fábrica de mármol y granito. 28+ colores de mármol egipcio en stock. Sinai Pearl, Galala Extra, Sunny marble. Proveedor directo.', '+20 2 2345 6789', NULL, 'Egipto', 'El Cairo', 30.0400, 31.2400),

  -- IRÁN
  ('00000000-0000-0000-0000-000000000037', 'info@mgtstone.com', 'MGT Stone Co.', 'cantero', 'standard', 'Empresa líder desde 2004. Cadena de valor completa: extracción, corte, procesamiento, acabado, embalaje, distribución. Mármol, travertino y ónix iraní.', '+98 21 8877 6655', 'https://mgtstone.com', 'Irán', 'Isfahán', 32.6500, 51.6800),

  -- CROACIA
  ('00000000-0000-0000-0000-000000000038', 'info@kamen.hr', 'Kamen d.d. Pazin', 'cantero', 'basic', 'Desde 1954. 7 canteras en Istria y Dalmacia. Caliza de Kanfanar (Pietra d''Istria), de tradición desde el siglo XV. Capacidad 21.000 m³/año.', '+385 52 624 000', NULL, 'Croacia', 'Pazin', 45.2400, 13.9400),

  -- CHINA
  ('00000000-0000-0000-0000-000000000039', 'info@wanlistone.com', 'WANLI Stone Group', 'cantero', 'standard', '3 canteras propias, 8 fábricas, 29 filiales. Clientes en Japón, Corea, EE.UU., Sudáfrica y UE. Mármol, granito y piedra ingenierizada.', '+86 592 5678 900', 'https://wanlistone.com', 'China', 'Xiamen', 24.4800, 118.0900),

  -- EE.UU. / CANADÁ
  ('00000000-0000-0000-0000-000000000040', 'info@polycor.com', 'Polycor Inc.', 'cantero', 'premium', 'Más de 60 canteras en EE.UU. y Canadá. Granito, mármol, caliza y esteatita. Propietarios de Georgia Marble Company. Canteras en Vermont (Barre, Bethel), Maine, Georgia, Pensilvania.', '+1 418 862 3333', 'https://polycor.com', 'Estados Unidos', 'Quebec City', 46.8100, -71.2100);

-- ============================================
-- FABRICANTES (Manufacturers)
-- ============================================
INSERT INTO profiles (id, email, company_name, role, subscription, description, phone, website, country, city, latitude, longitude) VALUES
  ('00000000-0000-0000-0000-000000000050', 'info@cosentino.com', 'Grupo Cosentino', 'fabricante', 'premium', 'Fundado en 1979 por la familia Cosentino. 4.300+ empleados. Silestone, Dekton y piedra natural. 14 canteras, 19 fábricas. Instalación de 493+ acres. Distribución en 110+ países.', '+34 950 444 175', 'https://cosentino.com', 'España', 'Cantoria', 37.3400, -2.1500),
  ('00000000-0000-0000-0000-000000000051', 'info@breton.it', 'Breton S.p.A.', 'fabricante', 'premium', 'Fundada en 1963 por Marcello Toncelli. 915 empleados. Facturación 305M€+. Líder mundial en maquinaria para piedra natural e ingenierizada. Inventores de la tecnología Bretonstone.', '+39 0423 7691', 'https://breton.it', 'Italia', 'Castello di Godego', 45.6800, 11.8800),
  ('00000000-0000-0000-0000-000000000052', 'info@pedrini.it', 'Pedrini S.p.A.', 'fabricante', 'standard', 'Fundada en 1962. 120 empleados. 30.000+ m² de instalaciones. Líder mundial en maquinaria de procesado de mármol y granito. Telares, hilo diamantado, líneas de pulido, CNC.', '+39 035 4253 411', 'https://pedrini.it', 'Italia', 'Carobbio degli Angeli', 45.6700, 9.8200),
  ('00000000-0000-0000-0000-000000000053', 'info@pietredirapolano.com', 'Pietre di Rapolano', 'fabricante', 'standard', 'Empresa familiar (familia Polvani, 2ª generación). Desde los 90 especialistas en travertino. Pioneros del e-commerce de piedra desde el año 2000. Colecciones de mobiliario de baño en piedra.', '+39 0577 724 000', 'https://pietredirapolano.com', 'Italia', 'Rapolano Terme', 43.2900, 11.6000),
  ('00000000-0000-0000-0000-000000000054', 'info@bestcheer.com', 'Best Cheer Group', 'fabricante', 'standard', 'Más de 20 años de experiencia. Tecnología minera respetuosa con el medio ambiente. Uno de los principales proveedores de piedra de China. Mármol, granito y piedra ingenierizada.', '+86 592 5123 456', 'https://bestcheer.com', 'China', 'Xiamen', 24.4800, 118.0900),
  ('00000000-0000-0000-0000-000000000055', 'info@fantini.eu', 'Fantini S.p.A.', 'fabricante', 'standard', 'Líder internacional en máquinas cortadoras de cadena para canteras. La 70RA/P es la sierra de cantera más vendida del mundo. Colaboración con Caterpillar en sistemas hidráulicos.', '+39 071 7108 700', 'https://fantini.eu', 'Italia', 'Osimo', 43.4800, 13.4800),
  ('00000000-0000-0000-0000-000000000056', 'info@caesarstone.com', 'Caesarstone', 'fabricante', 'premium', 'Pioneros de las superficies de cuarzo. Producción en Israel y EE.UU. (Georgia). Distribución global. Referente en encimeras de cuarzo.', '+972 4 610 9100', 'https://caesarstone.com', 'Israel', 'Sdot Yam', 32.4900, 34.8900);

-- ============================================
-- DISTRIBUIDORES (Distributors)
-- ============================================
INSERT INTO profiles (id, email, company_name, role, subscription, description, phone, website, country, city, latitude, longitude) VALUES
  ('00000000-0000-0000-0000-000000000060', 'info@msisurfaces.com', 'MSI (M S International)', 'distribuidor', 'premium', 'Sede: 13 acres, almacén de 170.000 sqft. 50+ showrooms/centros de distribución en EE.UU. y Canadá. Oficinas en India, China, Turquía, Brasil, Italia, México. Uno de los mayores distribuidores de piedra natural del mundo.', '+1 714 685 7500', 'https://msisurfaces.com', 'Estados Unidos', 'Orange, California', 33.7900, -117.8500),
  ('00000000-0000-0000-0000-000000000061', 'info@bfrg.com', 'Brachot Group', 'distribuidor', 'premium', 'Fundado en 1901. Líder internacional. 20 canteras (Francia, Portugal, Sudáfrica, Irlanda, Noruega). 7 centros de producción. 15 centros de distribución en Europa. Piedra natural, granito, mármol, caliza, pizarra, cuarzo, cerámica.', '+32 9 381 82 81', 'https://brachot.com', 'Bélgica', 'Deinze', 50.9800, 3.5300),
  ('00000000-0000-0000-0000-000000000062', 'info@bfrg.com', 'Nikolaus Bagnara S.p.A.', 'distribuidor', 'premium', 'Fundada en 1948. Tercera generación familiar. 950+ variedades de piedra natural. Canteras propias y sourcing mundial. Almacenes en Rivoli Veronese y Massa Carrara. Producción de 3.500 m² tablas/día.', '+39 0464 499 499', 'https://bfrg.com', 'Italia', 'Appiano', 46.4500, 11.2600),
  ('00000000-0000-0000-0000-000000000063', 'info@arizonatile.com', 'Arizona Tile', 'distribuidor', 'standard', 'Gran distribuidor estadounidense de tablas y baldosas de piedra natural. Caliza, mármol, dolomita, pizarra, cuarcita, granito. Múltiples ubicaciones en el oeste de EE.UU.', '+1 480 893 9393', 'https://arizonatile.com', 'Estados Unidos', 'Tempe, Arizona', 33.4300, -111.9400),
  ('00000000-0000-0000-0000-000000000064', 'info@walkerzanger.com', 'Walker Zanger', 'distribuidor', 'standard', '14 showrooms curados y galerías de tablas. 200+ distribuidores autorizados en EE.UU., Canadá y Japón. Mercado premium y de lujo en piedra natural.', '+1 818 504 0235', 'https://walkerzanger.com', 'Estados Unidos', 'Los Ángeles', 34.0500, -118.2400),
  ('00000000-0000-0000-0000-000000000065', 'info@porcelanosa.com', 'Porcelanosa Grupo', 'distribuidor', 'premium', 'Grupo español líder en cerámica, porcelánico y superficies de piedra natural. Showrooms en todo el mundo. Fundado en Villarreal.', '+34 964 507 100', 'https://porcelanosa.com', 'España', 'Villarreal', 39.9400, -0.1000),
  ('00000000-0000-0000-0000-000000000066', 'info@marazzi.it', 'Marazzi Group', 'distribuidor', 'standard', 'Fundada en 1935. Parte de Mohawk Industries. Fábrica en EE.UU. (Dallas). Fabricante y distribuidor líder de cerámica, porcelánico y piedra natural.', '+39 0536 860 800', 'https://marazzi.it', 'Italia', 'Sassuolo', 44.5300, 10.7900);

-- ============================================
-- ARQUITECTOS
-- ============================================
INSERT INTO profiles (id, email, company_name, role, subscription, description, phone, website, country, city, latitude, longitude) VALUES
  ('00000000-0000-0000-0000-000000000070', 'office@zumthor.ch', 'Peter Zumthor Architekt', 'arquitecto', 'free', 'Premio Pritzker 2009. Las Termas de Vals son una obra maestra de arquitectura en piedra: 60.000 losas de cuarcita local de Vals. Las juntas horizontales imitan líneas de agua.', '+41 81 354 0000', NULL, 'España', 'Haldenstein', 46.8700, 9.5300),
  ('00000000-0000-0000-0000-000000000071', 'info@herzogdemeuron.com', 'Herzog & de Meuron', 'arquitecto', 'free', 'Premio Pritzker. Stone House (Tavole, Italia) con piedra local apilada en seco. Tate Modern (Londres). Maestros en combinar materiales naturales y sintéticos.', '+41 61 385 5757', 'https://herzogdemeuron.com', 'España', 'Basilea', 47.5600, 7.5900),
  ('00000000-0000-0000-0000-000000000072', 'info@fosterandpartners.com', 'Foster + Partners', 'arquitecto', 'free', 'Uno de los estudios de arquitectura más prolíficos del mundo. Uso extensivo de piedra natural. Hearst Tower (NYC), London City Hall. Fachadas de granito y mármol a gran escala.', '+44 20 7738 0455', 'https://fosterandpartners.com', 'Reino Unido', 'Londres', 51.5100, -0.1300),
  ('00000000-0000-0000-0000-000000000073', 'info@kkaa.co.jp', 'Kengo Kuma & Associates', 'arquitecto', 'free', 'Muro cortina de piedra flotante en Haus Balma (Vals, Suiza) con 882 piezas de piedra, diseñado para Truffer Stone AG. Aplicaciones innovadoras de materiales.', '+81 3 3401 7721', 'https://kkaa.co.jp', 'India', 'Tokio', 35.6800, 139.7700),
  ('00000000-0000-0000-0000-000000000074', 'info@zaha-hadid.com', 'Zaha Hadid Architects', 'arquitecto', 'free', 'Diseño paramétrico. London Aquatics Centre (Olímpicos 2012) con fachada de granito. Stone Towers en El Cairo para Rooya Group.', '+44 20 7253 5147', 'https://zaha-hadid.com', 'Reino Unido', 'Londres', 51.5100, -0.1300),
  ('00000000-0000-0000-0000-000000000075', 'info@rafaelmoneo.com', 'Rafael Moneo', 'arquitecto', 'free', 'Premio Pritzker 1996. Arquitectura contextual con piedra local y mampostería. Museo Nacional de Arte Romano (Mérida), Kursaal (San Sebastián).', '+34 91 564 2257', NULL, 'España', 'Madrid', 40.4200, -3.7000),
  ('00000000-0000-0000-0000-000000000076', 'info@davidchipperfield.com', 'David Chipperfield Architects', 'arquitecto', 'free', 'Arquitecto británico famoso por edificios elegantes y simples con piedra como material principal de revestimiento. Neues Museum Berlín (caliza).', '+44 20 7267 9422', 'https://davidchipperfield.com', 'Reino Unido', 'Londres', 51.5100, -0.1300);

-- ============================================
-- DISEÑADORES
-- ============================================
INSERT INTO profiles (id, email, company_name, role, subscription, description, phone, website, country, city, latitude, longitude) VALUES
  ('00000000-0000-0000-0000-000000000080', 'info@budri.com', 'Budri', 'diseñador', 'free', 'Empresa italiana especializada en incrustaciones de mármol de lujo y mármol artístico. Trabajos a medida de decoración premium con piedra natural.', '+39 059 818 185', 'https://budri.com', 'Italia', 'Módena', 44.6500, 10.9200),
  ('00000000-0000-0000-0000-000000000081', 'info@kreoo.com', 'Kreoo', 'diseñador', 'free', 'Diseño italiano de lavabos, bañeras y mobiliario de baño tallados en bloques macizos de mármol. Piezas escultóricas para interiorismo de lujo.', '+39 049 940 0000', NULL, 'Italia', 'Padova', 45.4064, 11.8768),
  ('00000000-0000-0000-0000-000000000082', 'info@agapedesign.it', 'Agape Design', 'diseñador', 'free', 'Referente italiano en diseño de baños con piedra natural. Colaboraciones con diseñadores internacionales. Mármol de Carrara en piezas de autor.', '+39 0376 250 311', 'https://agapedesign.it', 'Italia', 'Mantova', 45.1600, 10.7900);

-- ============================================
-- CLIENTES FINALES
-- ============================================
INSERT INTO profiles (id, email, company_name, role, subscription, description, phone, website, country, city, latitude, longitude) VALUES
  ('00000000-0000-0000-0000-000000000090', 'info@mapei.com', 'Mapei S.p.A.', 'cliente', 'free', 'Fundada en 1937 en Milán. Sistemas de instalación de piedra y cerámica: adhesivos, rejuntes, selladores. Presencia global. Proveedor clave del sector.', '+39 02 376 731', 'https://mapei.com', 'Italia', 'Milán', 45.4600, 9.1900),
  ('00000000-0000-0000-0000-000000000091', 'info@laticrete.com', 'Laticrete', 'cliente', 'free', 'Fabricante americano de adhesivos, morteros y rejuntes para piedra y cerámica. Productos de alto rendimiento para instalación de mármol, granito y piedra natural.', '+1 203 393 0010', 'https://laticrete.com', 'Estados Unidos', 'Bethany, Connecticut', 41.4300, -72.9900),
  ('00000000-0000-0000-0000-000000000092', 'info@fourseasons.com', 'Four Seasons Hotels', 'cliente', 'free', 'Cadena hotelera de ultra lujo. Uso intensivo de mármol, travertino y piedra natural en lobbies, baños y zonas comunes de sus más de 120 hoteles en el mundo.', '+1 416 449 1750', 'https://fourseasons.com', 'Estados Unidos', 'Toronto', 43.6532, -79.3832),
  ('00000000-0000-0000-0000-000000000093', 'info@aman.com', 'Aman Resorts', 'cliente', 'free', 'Cadena de resorts de ultra lujo conocida por el uso de materiales naturales locales. Mármol, piedra y travertino en todos sus establecimientos.', '+65 6715 8855', 'https://aman.com', 'India', 'Singapur', 1.3521, 103.8198);

-- ============================================
-- PIEDRAS NATURALES
-- ============================================
INSERT INTO stones (owner_id, name, stone_type, colors, country_origin, finish, uses, description, price_range) VALUES
  -- Henraux
  ('00000000-0000-0000-0000-000000000001', 'Bianco Carrara C', 'marmol', '{blanco,gris}', 'Italia', '{pulido,apomazado}', '{suelo,revestimiento,encimera}', 'Mármol blanco con vetado gris elegante. El clásico italiano por excelencia. De los Alpes Apuanos.', 'alto'),
  ('00000000-0000-0000-0000-000000000001', 'Statuario Extra', 'marmol', '{blanco,gris}', 'Italia', '{pulido}', '{revestimiento,decoracion}', 'Extremadamente raro. Finas venas grises sobre blanco puro. Usado por Miguel Ángel. Calidad museo.', 'premium'),
  ('00000000-0000-0000-0000-000000000001', 'Calacatta Oro', 'marmol', '{blanco,amarillo}', 'Italia', '{pulido}', '{encimera,revestimiento,decoracion}', 'Vetas doradas sobre fondo blanco puro. Exclusivo y limitado. El mármol más codiciado del mundo.', 'premium'),

  -- Franchi Umberto Marmi
  ('00000000-0000-0000-0000-000000000002', 'Arabescato Corchia', 'marmol', '{blanco,gris}', 'Italia', '{pulido,apomazado}', '{revestimiento,decoracion}', 'Blanco con dramáticas vetas grises en patrones fluidos. De la cantera de Corchia, Carrara.', 'premium'),
  ('00000000-0000-0000-0000-000000000002', 'Bardiglio Nuvolato', 'marmol', '{gris}', 'Italia', '{pulido,apomazado}', '{suelo,revestimiento}', 'Mármol gris oscuro con nubosidad sutil. Elegancia sobria desde Carrara.', 'alto'),

  -- Margraf
  ('00000000-0000-0000-0000-000000000003', 'Nembro Rosato', 'marmol', '{rosa,beige}', 'Italia', '{pulido,apomazado}', '{suelo,revestimiento}', 'Mármol rosa-beige de Nembro (Bérgamo). Clásico calmante para grandes superficies.', 'alto'),
  ('00000000-0000-0000-0000-000000000003', 'Botticino Classico', 'marmol', '{beige}', 'Italia', '{pulido,apomazado}', '{suelo,revestimiento,fachada}', 'Beige suave con finas venas. De Brescia. Clásico del interiorismo italiano.', 'alto'),
  ('00000000-0000-0000-0000-000000000003', 'Fior di Pesco Carnico', 'marmol', '{gris,rosa}', 'Italia', '{pulido}', '{revestimiento,decoracion}', 'Mármol púrpura/gris de la Toscana. Efecto dramático en revestimientos. Limitado.', 'premium'),

  -- Antolini
  ('00000000-0000-0000-0000-000000000004', 'Patagonia', 'cuarcita', '{amarillo,marron,multicolor}', 'Brasil', '{pulido,apomazado}', '{encimera,revestimiento,decoracion}', 'Cuarcita multicolor con tonos dorados, marrones y grises. Cada pieza es una obra de arte natural.', 'premium'),
  ('00000000-0000-0000-0000-000000000004', 'Azul Bahia', 'granito', '{azul}', 'Brasil', '{pulido}', '{encimera,decoracion}', 'Granito azul vibrante exótico de Bahía. Una de las piedras más exclusivas y caras del mundo.', 'premium'),

  -- Levantina
  ('00000000-0000-0000-0000-000000000010', 'Crema Marfil', 'marmol', '{beige}', 'España', '{pulido,apomazado}', '{suelo,revestimiento,encimera,fachada}', 'El mármol más vendido del mundo. Tono beige cremoso uniforme. Cantera de Levantina en Novelda. 300.000m²/año.', 'medio'),
  ('00000000-0000-0000-0000-000000000010', 'Crema Marfil Select', 'marmol', '{beige}', 'España', '{pulido}', '{suelo,revestimiento,decoracion}', 'Selección premium con mínima variación de tono. Para proyectos que exigen uniformidad absoluta.', 'alto'),
  ('00000000-0000-0000-0000-000000000010', 'Gris Pulpis', 'caliza', '{gris,marron}', 'España', '{pulido,apomazado}', '{suelo,revestimiento,encimera}', 'Caliza micrítica gris oscura con fósiles. Cantera propia de Levantina en Castellón.', 'alto'),
  ('00000000-0000-0000-0000-000000000010', 'Emperador Dark', 'marmol', '{marron}', 'España', '{pulido}', '{suelo,revestimiento,encimera}', 'Mármol marrón oscuro con vetas beige/crema. De Alicante. Clásico del interiorismo de lujo.', 'alto'),

  -- Bateig
  ('00000000-0000-0000-0000-000000000011', 'Bateig Blue', 'caliza', '{azul,gris}', 'España', '{pulido,apomazado,abujardado}', '{fachada,suelo,revestimiento}', 'Caliza azulada única de la cantera exclusiva de Bateig en Novelda. Desde 1878.', 'medio'),
  ('00000000-0000-0000-0000-000000000011', 'Bateig Cream', 'caliza', '{beige}', 'España', '{pulido,apomazado}', '{fachada,suelo,revestimiento}', 'Caliza crema de Novelda. Muy versátil para interior y exterior.', 'medio'),

  -- Macael
  ('00000000-0000-0000-0000-000000000012', 'Blanco Macael', 'marmol', '{blanco}', 'España', '{pulido,apomazado}', '{suelo,revestimiento,encimera}', 'El "Oro Blanco" de Macael. Mármol blanco de referencia español. Utilizado en la Alhambra y el Palacio Real.', 'alto'),
  ('00000000-0000-0000-0000-000000000012', 'Gris Macael', 'marmol', '{gris}', 'España', '{pulido,apomazado}', '{suelo,revestimiento}', 'Mármol gris con elegante vetado blanco. Misma cantera que el Blanco Macael.', 'alto'),

  -- Granitos Cabaleiro
  ('00000000-0000-0000-0000-000000000014', 'Rosa Porriño', 'granito', '{rosa,gris}', 'España', '{pulido,flameado,abujardado}', '{suelo,exterior,fachada}', 'Granito rosa clásico gallego. Extremadamente resistente a la intemperie. El granito español más exportado.', 'medio'),
  ('00000000-0000-0000-0000-000000000014', 'Gris Mondariz', 'granito', '{gris}', 'España', '{pulido,flameado,arenado}', '{suelo,exterior,fachada,encimera}', 'Granito gris uniforme de grano fino. Ideal para gran formato y obra pública.', 'medio'),

  -- Cupa
  ('00000000-0000-0000-0000-000000000015', 'Cupa Heavy 3', 'pizarra', '{negro}', 'España', '{envejecido}', '{fachada,exterior}', 'Pizarra natural para cubiertas. La pizarra más vendida del mundo. Extraída en Ourense.', 'medio'),

  -- Tureks
  ('00000000-0000-0000-0000-000000000020', 'Silver Travertine', 'travertino', '{gris,beige}', 'Turquía', '{pulido,apomazado,envejecido}', '{suelo,revestimiento}', 'Travertino gris plateado de Burdur. Elegancia natural turca.', 'medio'),
  ('00000000-0000-0000-0000-000000000020', 'Noce Travertine', 'travertino', '{marron,beige}', 'Turquía', '{pulido,apomazado,tamboreado}', '{suelo,revestimiento,exterior}', 'Travertino nogal cálido de Denizli. Perfecto para ambientes mediterráneos.', 'medio'),
  ('00000000-0000-0000-0000-000000000020', 'Classic Travertine', 'travertino', '{beige}', 'Turquía', '{pulido,apomazado,envejecido,tamboreado}', '{suelo,revestimiento,fachada}', 'El travertino clásico por definición. Tono beige cálido y natural.', 'bajo'),
  ('00000000-0000-0000-0000-000000000020', 'Afyon White Marble', 'marmol', '{blanco}', 'Turquía', '{pulido}', '{revestimiento,suelo}', 'Mármol blanco turco de Afyonkarahisar. Alternativa competitiva al Carrara.', 'medio'),

  -- Vitória Stone
  ('00000000-0000-0000-0000-000000000025', 'Giallo Veneziano', 'granito', '{amarillo,marron}', 'Brasil', '{pulido}', '{encimera,suelo}', 'Granito amarillo/dorado brasileño. Uno de los granitos más populares del mundo.', 'medio'),
  ('00000000-0000-0000-0000-000000000025', 'Verde Ubatuba', 'granito', '{verde,negro}', 'Brasil', '{pulido}', '{encimera,suelo}', 'Granito verde oscuro con reflejos dorados. Clásico brasileño para encimeras.', 'medio'),
  ('00000000-0000-0000-0000-000000000025', 'Quartzite Taj Mahal', 'cuarcita', '{beige,amarillo}', 'Brasil', '{pulido,apomazado}', '{encimera,revestimiento}', 'Cuarcita dorada con sutiles venas. Dureza excepcional. Una joya de Espírito Santo.', 'premium'),

  -- R K Marble
  ('00000000-0000-0000-0000-000000000028', 'Makrana White', 'marmol', '{blanco}', 'India', '{pulido}', '{suelo,revestimiento,decoracion}', 'El mármol del Taj Mahal. Blanco puro de Makrana, Rajastán. 400 años de tradición extractiva.', 'alto'),
  ('00000000-0000-0000-0000-000000000028', 'Black Galaxy', 'granito', '{negro,amarillo}', 'India', '{pulido}', '{encimera,suelo,decoracion}', 'Granito negro con motas doradas de bronzita. De Andhra Pradesh. También llamado Star Galaxy.', 'alto'),
  ('00000000-0000-0000-0000-000000000028', 'Kashmir White', 'granito', '{blanco,rosa}', 'India', '{pulido}', '{encimera,suelo}', 'Granito blanco con motas de granate de Tamil Nadu. Uno de los granitos indios más exportados.', 'medio'),

  -- Stone Group International
  ('00000000-0000-0000-0000-000000000030', 'Thassos White', 'marmol', '{blanco}', 'Grecia', '{pulido}', '{revestimiento,suelo,decoracion}', 'El mármol más blanco del mundo. De la isla de Thasos. Pureza cristalina absoluta.', 'premium'),
  ('00000000-0000-0000-0000-000000000030', 'Volakas White', 'marmol', '{blanco,gris}', 'Grecia', '{pulido,apomazado}', '{suelo,revestimiento,encimera}', 'Mármol blanco griego con delicado vetado gris. Alternativa elegante al Carrara.', 'alto'),
  ('00000000-0000-0000-0000-000000000030', 'Kavala Semi-White', 'marmol', '{blanco,gris}', 'Grecia', '{pulido,apomazado}', '{suelo,revestimiento}', 'Mármol semi-blanco de Kavala. Tono más cálido que el Thassos. Muy versátil.', 'medio'),

  -- Filstone
  ('00000000-0000-0000-0000-000000000033', 'Moca Cream', 'caliza', '{beige}', 'Portugal', '{pulido,apomazado,abujardado}', '{suelo,revestimiento,fachada}', 'La caliza insignia de Portugal. Beige con venas paralelas. Piedra icónica portuguesa.', 'medio'),

  -- Lundhs
  ('00000000-0000-0000-0000-000000000035', 'Blue Pearl', 'granito', '{azul,gris}', 'Noruega', '{pulido}', '{encimera,revestimiento,decoracion}', 'Larvikita con cristales de feldespato azul. Solo existe en Larvik, Noruega. Exclusivo de Lundhs.', 'premium'),
  ('00000000-0000-0000-0000-000000000035', 'Emerald Pearl', 'granito', '{verde,negro}', 'Noruega', '{pulido}', '{encimera,revestimiento}', 'Larvikita verde oscuro con cristales azules/púrpura. Exclusivo de Noruega. Piedra única.', 'premium'),

  -- CID Egypt
  ('00000000-0000-0000-0000-000000000036', 'Sinai Pearl', 'caliza', '{beige}', 'Egipto', '{pulido,apomazado}', '{suelo,revestimiento,fachada}', 'Mármol/caliza del Sinaí. Tono perla suave. Muy usada en grandes proyectos de Oriente Medio.', 'bajo'),
  ('00000000-0000-0000-0000-000000000036', 'Galala Extra', 'caliza', '{beige}', 'Egipto', '{pulido,apomazado}', '{suelo,revestimiento,fachada}', 'Caliza beige de las montañas de Galala. Grano fino. Selección Extra para uniformidad.', 'bajo'),

  -- Polycor
  ('00000000-0000-0000-0000-000000000040', 'Vermont Danby White', 'marmol', '{blanco}', 'Estados Unidos', '{pulido,apomazado}', '{revestimiento,suelo,encimera}', 'Mármol blanco americano. Usado en el Supreme Court, Jefferson Memorial y Capitolio. Pureza y consistencia.', 'alto'),
  ('00000000-0000-0000-0000-000000000040', 'Barre Gray Granite', 'granito', '{gris}', 'Estados Unidos', '{pulido,flameado}', '{exterior,fachada,suelo}', 'El granito más famoso de América. De Barre, Vermont. Densidad y durabilidad excepcionales.', 'alto');

-- ============================================
-- IMÁGENES DE PIEDRAS
-- ============================================
INSERT INTO stone_images (stone_id, url, is_primary) VALUES
  ((SELECT id FROM stones WHERE name = 'Bianco Carrara C' LIMIT 1), 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Statuario Extra' LIMIT 1), 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Calacatta Oro' LIMIT 1), 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Arabescato Corchia' LIMIT 1), 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Bardiglio Nuvolato' LIMIT 1), 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Nembro Rosato' LIMIT 1), 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Botticino Classico' LIMIT 1), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Fior di Pesco Carnico' LIMIT 1), 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Patagonia' LIMIT 1), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Azul Bahia' LIMIT 1), 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Crema Marfil' LIMIT 1), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Crema Marfil Select' LIMIT 1), 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Gris Pulpis' LIMIT 1), 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Emperador Dark' LIMIT 1), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Bateig Blue' LIMIT 1), 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Bateig Cream' LIMIT 1), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Blanco Macael' LIMIT 1), 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Gris Macael' LIMIT 1), 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Rosa Porriño' LIMIT 1), 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Gris Mondariz' LIMIT 1), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Cupa Heavy 3' LIMIT 1), 'https://images.unsplash.com/photo-1600210491369-e753da4a0042?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Silver Travertine' LIMIT 1), 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Noce Travertine' LIMIT 1), 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Classic Travertine' LIMIT 1), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Afyon White Marble' LIMIT 1), 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Giallo Veneziano' LIMIT 1), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Verde Ubatuba' LIMIT 1), 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Quartzite Taj Mahal' LIMIT 1), 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Makrana White' LIMIT 1), 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Black Galaxy' LIMIT 1), 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Kashmir White' LIMIT 1), 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Thassos White' LIMIT 1), 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Volakas White' LIMIT 1), 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Kavala Semi-White' LIMIT 1), 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Moca Cream' LIMIT 1), 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Blue Pearl' LIMIT 1), 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Emerald Pearl' LIMIT 1), 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Sinai Pearl' LIMIT 1), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Galala Extra' LIMIT 1), 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Vermont Danby White' LIMIT 1), 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=450&fit=crop', true),
  ((SELECT id FROM stones WHERE name = 'Barre Gray Granite' LIMIT 1), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=450&fit=crop', true);

-- ============================================
-- MENSAJES DE CHAT
-- ============================================
INSERT INTO chat_messages (author_id, content, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Buenos días. Henraux acaba de abrir nuevo frente en nuestra cantera de los Alpes Apuanos. Calacatta Oro excepcional disponible en bloques de hasta 3,2m. Consultad disponibilidad.', NOW() - INTERVAL '6 days'),
  ('00000000-0000-0000-0000-000000000075', 'Buscamos mármol blanco para un proyecto cultural en Madrid. 6.000m² de suelo y 2.000m² de revestimiento. Necesitamos muestras de Carrara, Macael y Thassos.', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000000000012', 'Desde Macael podemos servir Blanco Macael para ese volumen. Le enviamos muestras esta semana. 2-3 semanas de plazo tras confirmar pedido.', NOW() - INTERVAL '5 days' + INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000030', 'Stone Group International también puede ofrecer Thassos White y Volakas. Tenemos tablas en stock en Tesalónica. Envío a España en 10 días.', NOW() - INTERVAL '5 days' + INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000010', 'Levantina presenta nueva línea de formatos XXL: tablas de hasta 3,20m x 1,60m en Crema Marfil, Gris Pulpis y Emperador Dark. Disponibles en todas nuestras delegaciones.', NOW() - INTERVAL '4 days'),
  ('00000000-0000-0000-0000-000000000025', 'Nuevas cuarcitas brasileñas en stock: Taj Mahal, Patagonia y Nacarado. Envíos a Europa desde Espírito Santo en 3 semanas. Vitória Stone Group.', NOW() - INTERVAL '3 days 12 hours'),
  ('00000000-0000-0000-0000-000000000080', '¿Alguien tiene experiencia con incrustaciones de mármol para un proyecto de hotel en Milán? Buscamos artesanos especializados. Budri.', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000000000004', 'Antolini tiene piezas únicas de ónix y cuarcitas exóticas ideales para incrustaciones. Podemos enviar catálogo de piezas especiales. Visiten nuestro showroom en Verona.', NOW() - INTERVAL '2 days 18 hours'),
  ('00000000-0000-0000-0000-000000000020', 'Tureks: Classic Travertine 40x60 tamboreado a precio especial. Liquidación de temporada. Solo quedan 5.000m² en almacén de Burdur.', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000060', 'MSI acaba de ampliar su stock de granito brasileño en el almacén de California. Giallo Veneziano, Verde Ubatuba y Azul Bahia disponibles. 50+ variedades.', NOW() - INTERVAL '1 day 12 hours'),
  ('00000000-0000-0000-0000-000000000061', 'Brachot Group busca nuevos proveedores de caliza portuguesa para nuestros centros de distribución en Europa. Interesados contactar.', NOW() - INTERVAL '1 day 6 hours'),
  ('00000000-0000-0000-0000-000000000033', 'Filstone puede ofrecer Moca Cream en grandes volúmenes. Calidad constante garantizada. Contacten directamente.', NOW() - INTERVAL '1 day 4 hours'),
  ('00000000-0000-0000-0000-000000000092', 'Four Seasons busca proveedor de travertino premium para la renovación de 3 hoteles en el Mediterráneo. 12.000m² totales. ¿Quién puede servir?', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000020', 'Podemos ofrecer Silver Travertine y Classic de primera calidad para Four Seasons. Tureks tiene experiencia en proyectos hoteleros de lujo.', NOW() - INTERVAL '22 hours'),
  ('00000000-0000-0000-0000-000000000015', 'Cupa Group anuncia nueva pizarra Cupa Heavy 3 con certificación LEED. Ideal para proyectos de arquitectura sostenible. Ya disponible.', NOW() - INTERVAL '18 hours'),
  ('00000000-0000-0000-0000-000000000072', 'Foster + Partners busca granito gris de alta densidad para fachada ventilada en proyecto de Londres. 8.000m². Necesitamos muestras urgentes.', NOW() - INTERVAL '12 hours'),
  ('00000000-0000-0000-0000-000000000014', 'Granitos Cabaleiro puede servir Gris Mondariz para esa fachada. Tenemos experiencia en proyectos de fachada ventilada en Reino Unido. Enviamos muestras mañana.', NOW() - INTERVAL '10 hours'),
  ('00000000-0000-0000-0000-000000000035', 'Lundhs Blue Pearl: nueva extracción con cristales excepcionales. Stock limitado de tablas 300x150. Solo disponible para proyectos premium.', NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0000-000000000051', 'Breton presenta nueva línea CNC para corte de mármol con precisión de 0,1mm. Ideal para piezas especiales y waterjet. Demo en Marmomac.', NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000028', 'R K Marble Group: Makrana White disponible en bloques y tablas. El mármol del Taj Mahal, ahora con capacidad de exportación global desde Kishangarh.', NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000040', 'Polycor: Vermont Danby White en stock. Tablas de 2m+ disponibles inmediatamente. El mármol blanco americano por excelencia.', NOW() - INTERVAL '30 minutes');

-- Reactivar restricciones FK
SET session_replication_role = DEFAULT;
