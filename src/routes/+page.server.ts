import appService from '$lib/appService';
import type { Event } from '$lib/appTypes';
import type { PageServerLoad } from './$types';

const getEvents = async (): Promise<Event[]> => {
	// Simulating API call
	const rawEvents = [
		// {
		// 	index: 0,
		// 	slug: 'ensenanza-conflicto-actual-con-origenes-biblicos-isaac-e-ismael',
		// 	imageLink: 'images/Enseñanza - Isaac e Ismael.jpg',
		// 	dateStrings: ['2024-11-09', '2024-11-10'],
		// 	description: `Este 9 y 10 de noviembre continuaremos con la serie: «Conflicto en medio oriente», ahora con el tema, Isaac e Ismael y compartiremos acerca de lo que la Biblia enseña sobre el judaísmo, los musulmanes y el cristianismo. Es de vital importancia conocer el origen de nuestra fe y sobre todo, porque creemos que Jesús y solamente Jesús es el único camino al Padre. Ven con tus amigos, invita a tus familiares.`,
		// },
		// {
		// 	index: 1,
		// 	slug: 'evento-disfrutando-amando-y-sonriendo',
		// 	imageLink: 'images/Evento - Disfrutando, amando y sonriendo.jpg',
		// 	dateStrings: ['2024-11-15'],
		// 	description: `<p>
		// 			En la vida matrimonial afrontamos importantes desafíos. Fortalecer esta unión desde los primeros años nos permitirá construir sobre cimientos firmes.
		// 		</p>
		// 		<p>
		// 			Si tenés entre 0 y 5 años de casados, te invitamos a continuar estrechando los lazos matrimoniales a través del tema: Disfrutando, amando y sonriendo.
		// 		</p>
		// 		<p>
		// 			Te esperamos en esta actividad diseñada para matrimonios jóvenes.
		// 		</p>
		// 		<p>
		// 			Próximo viernes 15 de noviembre, a las 7:15 p.m., en VAS.
		// 		</p>
		// 		<p>
		// 			Inscribite antes del 13 de noviembre y disfrutá de un espacio para compartir experiencias.
		// 		</p>
		// 		<p>
		// 			Inscripción en el siguiente link. <br />
		// 			<a href="https://forms.gle/CGduBTBdbSMkSJ577" target="_blank">https://forms.gle/CGduBTBdbSMkSJ577</a>
		// 		</p>
		// 		<p>
		// 			Información: matrimonios@vas.cr 6418-5055. <br />
		// 			Actividad gratuita.
		// 		</p>`,
		// },
		// {
		// 	index: 2,
		// 	slug: 'taller-la-navidad-empieza-con-cristo',
		// 	imageLink: 'images/Taller - La Navidad Empieza con Cristo.jpg',
		// 	dateStrings: ['2024-11-16'],
		// 	description: `
		// 		<p>
		// 			La Navidad empieza con Cristo, acompáñanos a inaugurar esta hermosa temporada y recordar que Jesús es el centro de nuestras vidas, te invitamos al taller de Tiempo Creativo con Dios, ven y comparte con nosotros, aprende sobre bisutería y scrapbook. Celebremos la navidad junto a Jesús.
		// 		</p>
		// 		<p>
		// 			🗓️16 Noviembre <br />
		// 			📞 8493-3636
		// 		</p>`,
		// },
		// {
		// 	index: 3,
		// 	slug: 'evento-hombres-gratitud',
		// 	imageLink: 'images/Evento - Gratitud.jpg',
		// 	dateStrings: ['2024-11-30'],
		// 	description: `
		// 		<p>
		// 			El Ministerio de Hombres VAS te invita a un espacio en el que reflexionaremos sobre la gratitud, y en el que le agradeceremos a Dios por su misericordia y fidelidad en nuestras vidas.
		// 		</p>
		// 		<p>
		// 			Apartá la fecha: sábado 30 de noviembre, de 10 a. m. a 2 p.m. La inversión es de 6 mil colones. Incluye una deliciosa parrillada y otras sorpresas.
		// 		</p>
		// 		<p>
		// 			Sinpe: 8385-6002.
		// 		</p>`,
		// },
		// {
		// 	index: 4,
		// 	slug: 'encuentro-matrimonial-acercate-a-mi',
		// 	imageLink: 'images/Encuentro Matrimonial - Acércate a mí.jpg',
		// 	dateStrings: ['2025-03-28', '2025-03-29', '2025-03-30'],
		// 	description: `
		// 		<p>
		// 			Volvamos a encontrarnos y a sonreír juntos, con esas cosas que un día nos unieron.
		// 		</p>
		// 		<p>
		// 			Es tiempo de levantarnos y de construir.
		// 		</p>
		// 		<p>
		// 			Encuentro matrimonial “Arcercate a mí”.
		// 		</p>
		// 		<p>
		// 			28, 29 y 30 Marzo, 2025.
		// 		</p>
		// 		<p>
		// 			Reservá la fecha.
		// 		</p>
		// 		<p>
		// 			<i>“Sobre todo, vístanse de amor, lo cual nos une a todos en perfecta armonía”</i>. <br />
		// 			<b>Colosenses: 3:14</b>
		// 		</p>
		// 	`,
		// },

		{
			index: 0,
			slug: 'emociones-que-matan',
			imageLink: 'images/Live - Emociones que matan.jpg',
			dateStrings: ['2024-08-28'],
			description: 'Los invitamos al programa Hablemos, con el Pastor Marco Vega y Fio',
		},
		{
			index: 1,
			slug: 'taller-autolesiones-y-la-conducta-suicida',
			imageLink: 'images/Evento - Taller.jpg',
			dateStrings: ['2024-09-07'],
			description:
				'Te invitamos al taller: “Comprendiendo a el dolor , la realidad detrás de las autolesiones y la conducta suicida”; donde conocerás como prevenir situaciones de riesgo de autolesiones, factores de riesgo, señales de alerta, detonantes, primeros auxilios psicológicos.',
		},
		{
			index: 2,
			slug: 'feria-empresarial-kids',
			imageLink: 'images/Evento - Feria Empresarial Kids.jpg',
			dateStrings: ['2024-09-07', '2024-09-08'],
			description:
				'Si eres un niño entre 4 a 11años y  tienes un emprendimiento el Ministerio de Excelencia te invita a participar en nuestra Feria Empresarial Kids a realizarse los días 7 y 8 de setiembre, para inscripciones contactar a Mariana Garro cel.8986-0649',
		},
		{
			index: 3,
			slug: 'curso-te-vuelvo-a-elegir',
			imageLink: 'images/Curso - Te vuelvo a elegir.jpg',
			dateStrings: ['2024-10-05', '2024-10-12', '2024-10-19'],
			description: `Curso Te Vuelvo a Elegir
		¿Deseas poner en orden tu vida matrimonial?
		¿Están en unión libre o solo casados por lo civil?
		 Los invitamos a ser parte del curso "Te vuelvo a elegir"
		 Los sábados 5-12-19 octubre, en horario de 8 am a 1 pm
		Requisitos:
		•⁠  ⁠Que ambos estén presentes los 3 sábados
		•⁠  ⁠Estar ambos en libertad de estado, para recibir la bendición del Señor por medio del pastor.
		Inversión ¢ 50.000.00 por pareja; incluye desayuno, materiales, expositores y más detalles.
		Sean parte de esta maravillosa experiencia en donde se compartirá y recibirán muchas herramientas para disfrutar la maravillosa aventura del matrimonio.
		Para inscripción o más información pueden escribir al 6418-5055
		https://forms.gle/39rHw2ERcf5XRUdt6`,
		},
		{
			index: 4,
			slug: 'curso-prematrimonial',
			imageLink: 'images/Curso - Prematrimonial.jpg',
			dateStrings: ['2024-10-05', '2024-10-12', '2024-10-19'],
			description: `Curso Prematrimonial VAS
		Dirigido a parejas de novios que no viven juntos y que este será su primer matrimonio.
		Los sábados 5-12-19 de octubre en horario de 8 am a 1 pm.
		Requisitos: que ambos estén presentes los 3 sábados.
		Fecha límite de inscripción 30 de Setiembre.
		Inversión ¢ 50.000.00 por pareja.
		Incluye desayuno, materiales, detalles, expositores y certificado.
		Nuestro curso es una oportunidad para recibir herramientas y consejos para construir un matrimonio saludable.
		Para más información pueden escribir al 7208-4652 con Yanerys Castro
		https://forms.gle/9vCzbFpu7KfgYGki7`,
		},
	];

	return rawEvents;
};

export const load: PageServerLoad = async () => {
	const rawEvents = await getEvents();
	const { eventList, weekList } = appService.generateAppData(rawEvents);

	return {
		eventList,
		weekList,
	};
};
