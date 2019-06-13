import React, { Component } from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Container, Segment } from 'semantic-ui-react';
import hubNoteLogo from '../images/logo_hubnote_200.png';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';

const cx = classNames.bind(stylesMain);


class TermsOfService extends Component {
	getMetaData() {
		return {
			title: 'HubNote | Terms of service | Connects between students | Take study notes | Take yours classes for a best organisation and share them | Note taking for students | create, discover, Save time, organize, share, browse the others, collaborate | courses, studies, DIY, tips, notes and knowledge between students',
			meta: [{ name: 'description', content: 'HubNote | Terms of service | Connects students | Take study notes | Take yours classes for a best organisation and share them | Note taking for students | create, discover, Save time, organize, share, browse the others, collaborate | courses, studies, DIY, tips, notes and knowledge between students' }],
			link: []
		};
	}

	render() {
		return (
			<LayoutPage {...this.getMetaData()}>
				<Segment vertical>
					<div className={cx('logo')}>
						<img src={hubNoteLogo} alt="Logo HubNote" />
					</div>

					<Container text>
						<div style={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
							{`
ENGLISH - TERMS OF SERVICE

UPDATE AT 01/01/2019

Definitions
User: any professional or natural person capable within the meaning of articles 1123 and following of the Civil Code, or legal person, who visits the Site subject to these terms and conditions.

HubNote provides:
● Content: All the constituent elements of the information on the Site, including text - images - videos.
● User information: Hereinafter referred to as "Information (s)" which correspond to all personal data that may be held by HubNote for the management of your account, the management of the user relationship and for the purposes of analyzes and statistics.
● Personal information: "Information that allows, in any form whatsoever, directly or indirectly, the identification of natural persons to which they apply" (Article 4 of Law No. 78-17 of 6 January 1978) .

The terms "personal data", "data subject", "subcontractor" and "sensitive data" have the meaning defined by the General Data Protection Regulation (GDPR: No. 2016-679)

1. Presentation of the website.
Under Article 6 of Law No. 2004-575 of 21 June 2004 on confidence in the digital economy, it is clear to users of the website HubNote identity of the various stakeholders in the context of its implementation and of his follow-up:

Owner: MARTIN Pierre - 97 rue de Paris 93100 Montreuil
Publication Manager: MARTIN Pierre - pierremartin.pro@gmail.com
The publication manager is a natural person or a legal person.
Webmaster: MARTIN Pierre - pierremartin.pro@gmail.com
Host: OVH - 2 rue Kellermann 59100 Roubaix 1007
Data Protection Officer: MARTIN Pierre - pierremartin.pro@gmail.com

2. General conditions of use of the site and services offered.
The Site constitutes a work of the spirit protected by the provisions of the Code of the Intellectual Property and the applicable International Regulations. The user may not in any way reuse, assign or exploit for his own account all or part of the elements or works of the Site.

The use of the HubNote website implies the full and complete acceptance of the general conditions of use described below. These Terms of Use may be amended or supplemented at any time, and HubNote users are encouraged to review them on a regular basis.

This website is normally accessible to users at any time. An interruption due to technical maintenance may however be decided by HubNote, who will then endeavor to communicate to users the dates and times of the intervention. The HubNote website is updated regularly by HubNote responsible. In the same way, the legal mentions can be modified at any time: they impose nevertheless on the user who is invited to refer to it as often as possible in order to take note of it.

3. Description of the services provided.
The purpose of the HubNote website is to provide information about all of the company's activities. HubNote strives to provide as accurate information as possible on the HubNote site. However, it can not be held responsible for the omissions, inaccuracies and deficiencies in the update, whether of its own doing or because of third party partners who provide this information.

All information listed on the HubNote site is for informational purposes only and is subject to change. In addition, the information on the HubNote site is not exhaustive. They are given subject to modifications having been made since they went on line.

4. Contractual limitations on the technical data.
The site uses JavaScript technology. The website can not be held responsible for material damage related to the use of the site. In addition, the user of the site agrees to access the site using recent equipment, not containing any viruses and with a latest generation browser Updated HubNote site is hosted by a provider in the territory of the European Union in accordance with the provisions of the General Data Protection Regulation (RGPD: n ° 2016-679)

The goal is to provide a service that ensures the best accessibility rate. The host ensures the continuity of its service 24 hours a day, every day of the year. However, it reserves the right to interrupt the hosting service for the shortest possible periods of time, in particular for maintenance purposes, to improve its infrastructures, to fail in its infrastructures or if the Services and Services generate deemed traffic. unnatural.

HubNote and the hosting provider can not be held responsible in the event of a malfunction of the Internet, telephone lines or computer and telephony equipment related in particular to the congestion of the network preventing access to the server.

5. Intellectual property and counterfeits.
HubNote owns the intellectual property rights and has the rights to use all the elements available on the website, including text, images, graphics, logos, videos, icons and sounds. Any reproduction, representation, modification, publication, adaptation of all or part of the elements of the site, whatever the means or process used, is prohibited without the prior written permission of: pierremartin.pro@gmail.com.

Any unauthorized use of the site or any of the elements it contains will be considered as constituting an infringement and prosecuted in accordance with the provisions of Articles L.335-2 and following of the Code of Intellectual Property.

6. Limitations of liability.
HubNote acts as the publisher of the site. HubNote is responsible for the quality and veracity of the Content it publishes.

HubNote will not be liable for any direct or indirect damage to the user's equipment when accessing the HubNote website and resulting from the use of equipment that does not meet the specifications in point 4, either the appearance of a bug or an incompatibility.

HubNote will also not be liable for consequential damages (such as a loss of market or loss of opportunity) arising from the use of the HubNote website. Interactive spaces (possibility to ask questions in the contact area) are available to users. HubNote reserves the right to remove, without prior notice, any content posted in this space that would violate the applicable law in France, especially the provisions on data protection. Where applicable, HubNote also reserves the right to question the user's civil and / or criminal liability, particularly in the event of a racist, abusive, defamatory or pornographic message, regardless of the medium used (text , photography …).

7. Management of personal data.
In connection with the use of the Site, the Service and / or the Platform, HubNote collects and processes certain personal data of its users. By using the Site, the Platform and / or the Service, Users recognize and accept the processing of their personal data by HubNote in accordance with its privacy policy accessible via the following link: `}<a href="/privacy-policy"> Privacy Policy </a>.

{`
8. Incident Notification
Whatever efforts are made, no method of transmission over the Internet and no method of electronic storage is completely secure. We can not therefore guarantee absolute security. If we become aware of a security breach, we will notify the affected users so that they can take appropriate action. Our incident reporting procedures take into account our legal obligations, whether at the national or European level. We are committed to fully informing our users of all matters relating to the security of their account and providing them with all the information they need to help them meet their own regulatory reporting requirements.

No personal information of the user of the HubNote website is published without the knowledge of the user, exchanged, transferred, assigned or sold on any support to third parties. Only the assumption of the acquisition of HubNote and its rights would allow the transmission of such information to the prospective purchaser who would in turn be given the same obligation to store and modify data with respect to the user of the HubNote site .

security
To ensure the security and confidentiality of Personal Data and Personal Health Data, HubNote uses networks protected by standard devices such as firewall, pseudonymization, encryption and password.

When processing Personal Data, HubNote shall take all reasonable steps to protect against any loss, misuse, unauthorized access, disclosure, alteration or destruction.

9. Hypertext links "cookies" and tags ("tags") internet
The HubNote site contains a number of hypertext links to other sites, set up with the permission of HubNote. However, HubNote does not have the ability to verify the content of the sites visited, and therefore assumes no liability for this fact.

Unless you decide to disable cookies, you agree that the site may use them. You may at any time disable these cookies for free from the deactivation possibilities offered to you and recalled below, knowing that this may reduce or prevent accessibility to all or part of the Services offered by the site.

9.1. COOKIES

A "cookie" is a small information file sent to the User's browser and stored in the User's terminal (eg computer, smartphone), (hereinafter "Cookies"). This file includes information such as the User's domain name, the User's Internet Service Provider, the User's operating system, and the date and time of access. The Cookies do not risk in any case to damage the terminal of the User.

HubNote may process the User's information concerning his visit to the Site, such as the pages consulted and the searches carried out. This information allows HubNote to improve the content of the Site, the navigation of the User.

Cookies facilitating the navigation and / or the provision of the services offered by the Site, the User can configure his browser to allow him to decide whether or not he wishes to accept them so that Cookies are registered in the Website. the terminal or, on the contrary, that they be rejected, either systematically or according to their issuer. The User can also configure his browser so that the acceptance or rejection of Cookies are proposed to him punctually, before a Cookie is likely to be registered in his terminal. HubNote informs the user that, in this case, it is possible that the functionality of its browser software is not all available.

If the User refuses the registration of Cookies in his terminal or his browser, or if the User deletes those who are registered there, the User is informed that his browsing and his experience on the Site may be limited. This could also be the case when HubNote or one of its service providers can not recognize, for technical compatibility purposes, the type of browser used by the device, the language and display settings, or the country from which the device was accessed. terminal seems connected to the Internet.

If applicable, HubNote declines any responsibility for the consequences related to the degraded operation of the Site and the services possibly offered by HubNote, resulting (i) from the refusal of Cookies by the User (ii) the impossibility for HubNote to register or to consult the Cookies necessary for their operation because of the choice of the User. For the management of Cookies and the choices of the User, the configuration of each browser is different. It is described in the help menu of the browser, which will indicate how the user can change his wishes for cookies.

At any time, the User can make the choice to express and modify his wishes regarding Cookies. In addition, HubNote may use the services of external service providers to help collect and process the information described in this section.

Finally, by clicking on the icons dedicated to Twitter, Facebook, Linkedin and Google Plus social networks appearing on the HubNote Website or in its mobile application and if the User has accepted the deposit of cookies while continuing to browse the Website or The mobile application of HubNote, Twitter, Facebook, Linkedin and Google Plus can also place cookies on your devices (computer, tablet, mobile phone).

These types of cookies are only placed on your devices if you consent, by continuing to browse the HubNote Website or mobile application. At any time, the User may nevertheless reconsider his consent for HubNote to deposit this type of cookie.

Article 9.2. TAGS ("TAGS") INTERNET

HubNote may occasionally use Internet tags (also known as "tags", or action tags, one-pixel GIFs, transparent GIFs, invisible GIFs, and one-to-one GIFs) and deploy them through a specialist partner. Web analytics likely to be located (and therefore to store the corresponding information, including the IP address of the User) in a foreign country.

These tags are placed both in online advertisements allowing users to access the Site, and on the various pages of it.

This technology allows HubNote to evaluate the visitors' responses to the Site and the effectiveness of its actions (for example, the number of times a page is opened and the information accessed), as well as the use of this Site by the user.

The external service provider may collect information about visitors to the Site and other websites through these tags, compile reports on Site activity for HubNote, and provide other services related to the website. use of it and the Internet.

10. Applicable law and jurisdiction.
Any dispute in connection with the use of the HubNote website is subject to French law. Except in cases where the law does not allow it, exclusive jurisdiction is conferred on the competent courts.
						 `}
						</div>
					</Container>

					<hr />

					<Container text>
						<div style={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
							{`
FRANCAIS - CONDITIONS GÉNÉRALES D'UTILISATION

Mise à jour le 01/01/2019

Définitions
Utilisateur : tout professionnel ou personne physique capable au sens des articles 1123 et suivants du Code civil, ou personne morale, qui visite le Site objet des présentes conditions générales.

HubNote met à disposition :
● du contenu : Ensemble des éléments constituants l’information présente sur le Site, notamment textes – images – vidéos.
● Des informations utilisateurs : Ci après dénommé « Information (s) » qui correspondent à l’ensemble des données personnelles susceptibles d’être détenues par HubNote pour la gestion de votre compte, de la gestion de la relation utilisateur et à des fins d’analyses et de statistiques.
● Des informations personnelles : « Les informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).

Les termes « données à caractère personnel », « personne concernée », « sous traitant » et « données sensibles » ont le sens défini par le Règlement Général sur la Protection des Données (RGPD : n° 2016-679)

1. Présentation du site internet.
En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs du site internet HubNote l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi:

Propriétaire : MARTIN Pierre – 97 rue de Paris 93100 Montreuil
Responsable publication : MARTIN Pierre – pierremartin.pro@gmail.com
Le responsable publication est une personne physique ou une personne morale.
Webmaster : MARTIN Pierre – pierremartin.pro@gmail.com
Hébergeur : OVH – 2 rue Kellermann 59100 Roubaix 1007
Délégué à la protection des données : MARTIN Pierre – pierremartin.pro@gmail.com

2. Conditions générales d’utilisation du site et des services proposés.
Le Site constitue une œuvre de l’esprit protégée par les dispositions du Code de la Propriété Intellectuelle et des Réglementations Internationales applicables. L'utilisateur ne peut en aucune manière réutiliser, céder ou exploiter pour son propre compte tout ou partie des éléments ou travaux du Site.

L’utilisation du site HubNote implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site HubNote sont donc invités à les consulter de manière régulière.

Ce site internet est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par HubNote, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention. Le site web HubNote est mis à jour régulièrement par HubNote responsable. De la même façon, les mentions légales peuvent être modifiées à tout moment : elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent possible afin d’en prendre connaissance.

3. Description des services fournis.
Le site internet HubNote a pour objet de fournir une information concernant l’ensemble des activités de la société. HubNote s’efforce de fournir sur le site HubNote des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des oublis, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.

Toutes les informations indiquées sur le site HubNote sont données à titre indicatif, et sont susceptibles d’évoluer. Par ailleurs, les renseignements figurant sur le site HubNote ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.

4. Limitations contractuelles sur les données techniques.
Le site utilise la technologie JavaScript. Le site Internet ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis-à-jour Le site HubNote est hébergé chez un prestataire sur le territoire de l’Union Européenne conformément aux dispositions du Règlement Général sur la Protection des Données (RGPD : n° 2016-679)

L’objectif est d’apporter une prestation qui assure le meilleur taux d’accessibilité. L’hébergeur assure la continuité de son service 24 Heures sur 24, tous les jours de l’année. Il se réserve néanmoins la possibilité d’interrompre le service d’hébergement pour les durées les plus courtes possibles notamment à des fins de maintenance, d’amélioration de ses infrastructures, de défaillance de ses infrastructures ou si les Prestations et Services génèrent un trafic réputé anormal.

HubNote et l’hébergeur ne pourront être tenus responsables en cas de dysfonctionnement du réseau Internet, des lignes téléphoniques ou du matériel informatique et de téléphonie lié notamment à l’encombrement du réseau empêchant l’accès au serveur.

5. Propriété intellectuelle et contrefaçons.
HubNote est propriétaire des droits de propriété intellectuelle et détient les droits d’usage sur tous les éléments accessibles sur le site internet, notamment les textes, images, graphismes, logos, vidéos, icônes et sons. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de : pierremartin.pro@gmail.com.

Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il contient sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.

6. Limitations de responsabilité.
HubNote agit en tant qu’éditeur du site. HubNote est responsable de la qualité et de la véracité du Contenu qu’il publie.

HubNote ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site internet HubNote, et résultant soit de l’utilisation d’un matériel ne répondant pas aux spécifications indiquées au point 4, soit de l’apparition d’un bug ou d’une incompatibilité.

HubNote ne pourra également être tenu responsable des dommages indirects (tels par exemple qu’une perte de marché ou perte d’une chance) consécutifs à l’utilisation du site HubNote. Des espaces interactifs (possibilité de poser des questions dans l’espace contact) sont à la disposition des utilisateurs. HubNote se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données. Le cas échéant, HubNote se réserve également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l’utilisateur, notamment en cas de message à caractère raciste, injurieux, diffamant, ou pornographique, quel que soit le support utilisé (texte, photographie …).

7. Gestion des données personnelles.
Dans le cadre de l’utilisation du Site, du Service et/ou de la Plateforme, HubNote collecte et traite certaines données personnelles de ses utilisateurs. En utilisant le Site, la Plateforme et/ou le Service, les utilisateurs reconnaissent et acceptent le traitement de leurs données personnelles par HubNote conformément à sa politique de confidentialité accessible via le lien suivant : `}<a href="/privacy-policy">Politique de confidentialité</a>.

{`
8. Notification d’incident
Quels que soient les efforts fournis, aucune méthode de transmission sur Internet et aucune méthode de stockage électronique n'est complètement sûre. Nous ne pouvons en conséquence pas garantir une sécurité absolue. Si nous prenions connaissance d'une brèche de la sécurité, nous avertirions les utilisateurs concernés afin qu'ils puissent prendre les mesures appropriées. Nos procédures de notification d’incident tiennent compte de nos obligations légales, qu'elles se situent au niveau national ou européen. Nous nous engageons à informer pleinement nos utilisateurs de toutes les questions relevant de la sécurité de leur compte et à leur fournir toutes les informations nécessaires pour les aider à respecter leurs propres obligations réglementaires en matière de reporting.

Aucune information personnelle de l'utilisateur du site HubNote n'est publiée à l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l'hypothèse du rachat de HubNote et de ses droits permettrait la transmission des dites informations à l'éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis de l'utilisateur du site HubNote.

Sécurité
Pour assurer la sécurité et la confidentialité des Données Personnelles et des Données Personnelles de Santé, HubNote utilise des réseaux protégés par des dispositifs standards tels que par pare-feu, la pseudonymisation, l’encryption et mot de passe.

Lors du traitement des Données Personnelles, HubNote prend toutes les mesures raisonnables visant à les protéger contre toute perte, utilisation détournée, accès non autorisé, divulgation, altération ou destruction.

9. Liens hypertextes « cookies » et balises ("tags") internet
Le site HubNote contient un certain nombre de liens hypertextes vers d’autres sites, mis en place avec l’autorisation de HubNote. Cependant, HubNote n’a pas la possibilité de vérifier le contenu des sites ainsi visités, et n’assumera en conséquence aucune responsabilité de ce fait.

Sauf si vous décidez de désactiver les cookies, vous acceptez que le site puisse les utiliser. Vous pouvez à tout moment désactiver ces cookies et ce gratuitement à partir des possibilités de désactivation qui vous sont offertes et rappelées ci-après, sachant que cela peut réduire ou empêcher l’accessibilité à tout ou partie des Services proposés par le site.

9.1. COOKIES

Un « cookie » est un petit fichier d’information envoyé sur le navigateur de l’Utilisateur et enregistré au sein du terminal de l’Utilisateur (ex : ordinateur, smartphone), (ci-après « Cookies »). Ce fichier comprend des informations telles que le nom de domaine de l’Utilisateur, le fournisseur d’accès Internet de l’Utilisateur, le système d’exploitation de l’Utilisateur, ainsi que la date et l’heure d’accès. Les Cookies ne risquent en aucun cas d’endommager le terminal de l’Utilisateur.

HubNote est susceptible de traiter les informations de l’Utilisateur concernant sa visite du Site, telles que les pages consultées, les recherches effectuées. Ces informations permettent à HubNote d’améliorer le contenu du Site, de la navigation de l’Utilisateur.

Les Cookies facilitant la navigation et/ou la fourniture des services proposés par le Site, l’Utilisateur peut configurer son navigateur pour qu’il lui permette de décider s’il souhaite ou non les accepter de manière à ce que des Cookies soient enregistrés dans le terminal ou, au contraire, qu’ils soient rejetés, soit systématiquement, soit selon leur émetteur. L’Utilisateur peut également configurer son logiciel de navigation de manière à ce que l’acceptation ou le refus des Cookies lui soient proposés ponctuellement, avant qu’un Cookie soit susceptible d’être enregistré dans son terminal. HubNote informe l’Utilisateur que, dans ce cas, il se peut que les fonctionnalités de son logiciel de navigation ne soient pas toutes disponibles.

Si l’Utilisateur refuse l’enregistrement de Cookies dans son terminal ou son navigateur, ou si l’Utilisateur supprime ceux qui y sont enregistrés, l’Utilisateur est informé que sa navigation et son expérience sur le Site peuvent être limitées. Cela pourrait également être le cas lorsque HubNote ou l’un de ses prestataires ne peut pas reconnaître, à des fins de compatibilité technique, le type de navigateur utilisé par le terminal, les paramètres de langue et d’affichage ou le pays depuis lequel le terminal semble connecté à Internet.

Le cas échéant, HubNote décline toute responsabilité pour les conséquences liées au fonctionnement dégradé du Site et des services éventuellement proposés par HubNote, résultant (i) du refus de Cookies par l’Utilisateur (ii) de l’impossibilité pour HubNote d’enregistrer ou de consulter les Cookies nécessaires à leur fonctionnement du fait du choix de l’Utilisateur. Pour la gestion des Cookies et des choix de l’Utilisateur, la configuration de chaque navigateur est différente. Elle est décrite dans le menu d’aide du navigateur, qui permettra de savoir de quelle manière l’Utilisateur peut modifier ses souhaits en matière de Cookies.

À tout moment, l’Utilisateur peut faire le choix d’exprimer et de modifier ses souhaits en matière de Cookies. HubNote pourra en outre faire appel aux services de prestataires externes pour l’aider à recueillir et traiter les informations décrites dans cette section.

Enfin, en cliquant sur les icônes dédiées aux réseaux sociaux Twitter, Facebook, Linkedin et Google Plus figurant sur le Site de HubNote ou dans son application mobile et si l’Utilisateur a accepté le dépôt de cookies en poursuivant sa navigation sur le Site Internet ou l’application mobile de HubNote, Twitter, Facebook, Linkedin et Google Plus peuvent également déposer des cookies sur vos terminaux (ordinateur, tablette, téléphone portable).

Ces types de cookies ne sont déposés sur vos terminaux qu’à condition que vous y consentiez, en continuant votre navigation sur le Site Internet ou l’application mobile de HubNote. À tout moment, l’Utilisateur peut néanmoins revenir sur son consentement à ce que HubNote dépose ce type de cookies.

Article 9.2. BALISES ("TAGS") INTERNET

HubNote peut employer occasionnellement des balises Internet (également appelées « tags », ou balises d’action, GIF à un pixel, GIF transparents, GIF invisibles et GIF un à un) et les déployer par l’intermédiaire d’un partenaire spécialiste d’analyses Web susceptible de se trouver (et donc de stocker les informations correspondantes, y compris l’adresse IP de l’Utilisateur) dans un pays étranger.

Ces balises sont placées à la fois dans les publicités en ligne permettant aux internautes d’accéder au Site, et sur les différentes pages de celui-ci.

Cette technologie permet à HubNote d’évaluer les réponses des visiteurs face au Site et l’efficacité de ses actions (par exemple, le nombre de fois où une page est ouverte et les informations consultées), ainsi que l’utilisation de ce Site par l’Utilisateur.

Le prestataire externe pourra éventuellement recueillir des informations sur les visiteurs du Site et d’autres sites Internet grâce à ces balises, constituer des rapports sur l’activité du Site à l’attention de HubNote, et fournir d’autres services relatifs à l’utilisation de celui-ci et d’Internet.

10. Droit applicable et attribution de juridiction.
Tout litige en relation avec l’utilisation du site HubNote est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.
						 `}
						</div>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

export default TermsOfService;
