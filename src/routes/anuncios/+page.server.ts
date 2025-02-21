import type { Announcement } from '$lib/appTypes';
import type { PageServerLoad } from './$types';

const getAnnouncementList = async (): Promise<Announcement[]> => {
	// Simulating API call
	const rawAnnouncements: Announcement[] = [
		{
			index: 0,
			slug: 'campamento-made-new',
			imageLink: 'images/Anuncio - Campamento Made New.jpg',
			description: `<p>Campamento Made New</p>

				<p>¡Viví la experiencia de campa junto a nosotros!<br />
				Un fin de semana lleno de aventura, competencias, sorpresas y mucho más. </p>

				<p>Inscribite ya y aparta tu espacio para este tiempo tan especial con Dios.<br />
				Si tenés entre 18 y 25 años, te invitamos a inscribirte con tan solo 10.000 colones. </p>

				<p>Costo total: 65.000 colones<br />
				Más información al 60298843. <br />
				No te lo pierdas</p>

				<p><a href="https://www.facebook.com/soyuneco">Jóvenes ECO</a> <a href="https://www.instagram.com/soyuneco">soyuneco</a></p>`,
		},
		{
			index: 1,
			slug: 'anuncio-escuela-de-musica',
			imageLink: 'images/Anuncio - Escuela de música.jpg',
			description: `<p>Deseas aprender a tocar el teclado, violín, guitarra, bajo y batería, solfeo, armonía moderna, lectura de partituras, esta es tu oportunidad. La escuela de música VAS apertura clases los días sábados; si aún no cuentas con el instrumento no te preocupes puede iniciar aprendiendo música.</p>

				<p>Enfocado a niños mayores de 7 años.</p>

				<p>Para más información con Daniel Monge y Allison Gámez<br />
				86280444 - 84025305</p>`,
		},
		{
			index: 2,
			slug: 'anuncio-invitacion-al-gps-de-excelencia',
			imageLink: 'images/Anuncio - Invitación al GPS de Excelencia.jpg',
			description: `<p><a href="https://www.facebook.com/excelenciavas">Ministerio Excelencia VAS</a></p>

				<p>Si una de tus metas para el 2024 es emprender te invitamos al GPS del Ministerio de emprendedores y empresarios de VAS donde juntos crecemos de una manera integral.</p>

				<p>Para más información contáctanos al 8758-3271</p>`,
		},
	];

	return rawAnnouncements;
};

export const load: PageServerLoad = async () => {
	const announcementList = await getAnnouncementList();

	return {
		announcementList,
	};
};
