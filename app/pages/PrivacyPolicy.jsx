import React, { Component } from 'react';
import LayoutPage from '../components/layouts/LayoutPage/LayoutPage';
import { Container, Segment } from 'semantic-ui-react';
import hubNoteLogo from '../images/logo_hubnote_200.png';
import classNames from 'classnames/bind';
import stylesMain from '../css/main.scss';

const cx = classNames.bind(stylesMain);


class PrivacyPolicy extends Component {
	getMetaData() {
		return {
			title: 'HubNote | Privacy policy | Connects between students | Take study notes | Take yours classes for a best organisation and share them | Note taking for students | create, discover, Save time, organize, share, browse the others, collaborate | courses, studies, DIY, tips, notes and knowledge between students',
			meta: [{ name: 'description', content: 'HubNote | Privacy policy | Connects students | Take study notes | Take yours classes for a best organisation and share them | Note taking for students | create, discover, Save time, organize, share, browse the others, collaborate | courses, studies, DIY, tips, notes and knowledge between students' }],
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
ENGLISH - PRIVACY POLICY

Updated on 01/01/2019

1. Management of personal data.
The user is informed of the regulations concerning marketing communication, the law of June 21, 2014 for confidence in the Digital Economy, the Data Protection Act of August 06, 2004 and the General Data Protection Regulation (RGPD: n 2016-679).

1.1 Responsible for the collection of personal data
For Personal Data collected as part of the creation of the personal account of the user and its navigation on the Site, the Person in charge of the processing of Personal Data is: MARTIN Pierre. HubNote is represented by MARTIN Pierre, its legal representative.

As the data controller it collects, HubNote is committed to complying with the legal provisions in force. In particular, it is up to the user to establish the purposes of his data processing, to provide his prospects and customers, from the collection of their consents, complete information on the processing of their personal data and maintain a register of treatments according to reality. Whenever HubNote processes Personal Data, HubNote takes all reasonable steps to ensure that the Personal Data is accurate and relevant to the purposes for which HubNote processes it.

1.2 Purpose of the data collected
HubNote may process all or part of the data:

● to enable navigation on the Site and the management and traceability of services and services ordered by the user: login and use of the Site, invoicing, order history, etc.
● to prevent and fight against computer fraud (spamming, hacking ...): computer hardware used for navigation, IP address, password (hash).
● to improve navigation on the Site: login and usage data.
● to conduct optional satisfaction surveys on HubNote: email address.
● to carry out communication campaigns (sms, mail): phone number, email address.
● HubNote does not commercialize your personal data which is therefore only used by necessity or for statistical and analytical purposes.

1.3 Right of access, rectification and opposition
In accordance with current European regulations, HubNote users have the following rights:

● right of access (article 15 RGPD) and rectification (article 16 RGPD), updating, completeness of the data of Users right of locking or erasing data of the Users of a personal nature (article 17 of the RGPD) , when they are inaccurate, incomplete, equivocal, out of date, or whose collection, use, communication or preservation is prohibited.
● right to withdraw consent at any time (article 13-2c RGPD).
● right to limit the processing of User data (article 18 RGPD).
● right to oppose the processing of User data (article 21 RGPD).
● right to the portability of the data that the Users will have provided, when this data is the subject of automated processing based on their consent or on a contract (article 20 RGPD).
● the right to define the fate of Users' data after their death and to choose to whom HubNote will have to communicate (or not) their data to a third party they have previously designated.

As soon as HubNote becomes aware of the death of a user and if no instructions are given by HubNote, HubNote undertakes to destroy its data, unless it is necessary to keep them for probative purposes or to fulfill a legal obligation.

If the User wishes to know how HubNote uses his Personal Data, ask to rectify or oppose their treatment, the User may contact HubNote in writing at the following address:
email : pierremartin.pro@gmail.com
adress : MARTIN Pierre - 97 rue de Paris 93100 Montreuil.
In this case, the user must indicate the Personal Data he / she would like HubNote to correct, update or delete by identifying himself / herself with a copy of an identity document (identity card or passport).

Requests for deletion of Personal Data will be subject to the obligations imposed on HubNote by law, including the retention or archiving of documents. Lastly, HubNote Users may lodge a complaint with the supervisory authorities, particularly the CNIL (https://www.cnil.fr/en/complaints).

1.4 Non-disclosure of personal data
HubNote is prohibited from processing, hosting or transferring the collected information on its users to a country located outside the European Union or recognized as "unsuitable" by the European Commission without first informing the user. However, HubNote remains free from the choice of its technical and commercial subcontractors on the condition that it presents sufficient guarantees with regard to the requirements of the General Regulation on Data Protection (RGPD: No. 2016-679).

HubNote undertakes to take all necessary precautions to preserve the security of the Information and in particular that it is not communicated to unauthorized persons. However, if an incident affecting the integrity or confidentiality of the User Information is brought to the attention of HubNote, it shall promptly inform the user and notify him of the corrective measures taken. In addition, HubNote does not collect any "sensitive data".

The User's Personal Data may be processed by HubNote Subsidiaries and Subcontractors (Service Providers) exclusively for the purposes of this Policy.

Within the limits of their respective attributions and for the purposes mentioned above, the main people likely to have access to the HubNote Users' data are mainly the agents of our customer service.

1.5 Types of data collected
Regarding the users of a HubNote Site, we collect the following data which are essential for the operation of the service, and which will be kept for a maximum period of 2 months following the end of the contractual relationship:
● name
● first name
● email
● username (login)

HubNote also collects information that improves the user experience and provides contextualized advice:
● date of birth
● age
● about
● profession
● name of the school
● avatars

These data are kept for a maximum period of 2 months after the end of the contractual relationship

2. Incident Notification
Whatever efforts are made, no method of transmission over the Internet and no method of electronic storage is completely secure. We can not therefore guarantee absolute security. If we become aware of a security breach, we will notify the affected users so that they can take appropriate action. Our incident reporting procedures take into account our legal obligations, whether at the national or European level. We are committed to fully informing our users of all matters relating to the security of their account and providing them with all the information they need to help them meet their own regulatory reporting requirements.

No personal information of the user of the HubNote website is published without the knowledge of the user, exchanged, transferred, assigned or sold on any support to third parties. Only the assumption of the acquisition of HubNote and its rights would allow the transmission of such information to the prospective purchaser who would in turn be given the same obligation to store and modify data with respect to the user of the HubNote site .

security
To ensure the security and confidentiality of Personal Data and Personal Health Data, HubNote uses networks protected by standard devices such as firewall, pseudonymization, encryption and password.

When processing Personal Data, HubNote shall take all reasonable steps to protect it against loss, misuse, unauthorized access, disclosure, alteration or destruction.

3. Hypertext links "cookies" and tags ("tags") internet
The HubNote site contains a number of hypertext links to other sites, set up with the permission of HubNote. However, HubNote does not have the ability to verify the content of the sites visited, and therefore assumes no liability for this fact.

Unless you decide to disable cookies, you agree that the site may use them. You may at any time disable these cookies for free from the deactivation possibilities offered to you and recalled below, knowing that this may reduce or prevent accessibility to all or part of the Services offered by the site.

3.1. COOKIES
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

4. Applicable law and jurisdiction.
Any dispute in connection with the use of the HubNote website is subject to French law. Except in cases where the law does not allow it, exclusive jurisdiction is conferred on the competent courts.
						 `}
						</div>
					</Container>

					<hr />

					<Container text>
						<div style={{ whiteSpace: 'pre-line', fontSize: '1rem' }}>
							{`
FRANCAIS - POLITIQUE DE CONFIDENTIALITÉ

Mise à jour le 01/01/2019

1. Gestion des données personnelles.
L'utilisateur est informé des réglementations concernant la communication marketing, la loi du 21 Juin 2014 pour la confiance dans l’Economie Numérique, la Loi Informatique et Liberté du 06 Août 2004 ainsi que du Règlement Général sur la Protection des Données (RGPD : n° 2016-679).

1.1 Responsables de la collecte des données personnelles
Pour les Données Personnelles collectées dans le cadre de la création du compte personnel de l’utilisateur et de sa navigation sur le Site, le responsable du traitement des Données Personnelles est : MARTIN Pierre. HubNote est représenté par MARTIN Pierre, son représentant légal.

En tant que responsable du traitement des données qu’il collecte, HubNote s’engage à respecter le cadre des dispositions légales en vigueur. Il lui appartient notamment à l'utilisateur d’établir les finalités de ses traitements de données, de fournir à ses prospects et clients, à partir de la collecte de leurs consentements, une information complète sur le traitement de leurs données personnelles et de maintenir un registre des traitements conforme à la réalité. Chaque fois que HubNote traite des Données Personnelles, HubNote prend toutes les mesures raisonnables pour s’assurer de l’exactitude et de la pertinence des Données Personnelles au regard des finalités pour lesquelles HubNote les traite.

1.2 Finalité des données collectées
HubNote est susceptible de traiter tout ou partie des données :

● pour permettre la navigation sur le Site et la gestion et la traçabilité des prestations et services commandés par l’utilisateur : données de connexion et d’utilisation du Site, facturation, historique des commandes, etc.
● pour prévenir et lutter contre la fraude informatique (spamming, hacking…) : matériel informatique utilisé pour la navigation, l’adresse IP, le mot de passe (hashé).
● pour améliorer la navigation sur le Site : données de connexion et d’utilisation.
● pour mener des enquêtes de satisfaction facultatives sur HubNote : adresse email.
● pour mener des campagnes de communication (sms, mail) : numéro de téléphone, adresse email.
● HubNote ne commercialise pas vos données personnelles qui sont donc uniquement utilisées par nécessité ou à des fins statistiques et d’analyses.

1.3 Droit d’accès, de rectification et d’opposition
Conformément à la réglementation européenne en vigueur, les utilisateurs de HubNote disposent des droits suivants :

● droit d'accès (article 15 RGPD) et de rectification (article 16 RGPD), de mise à jour, de complétude des données des Utilisateurs droit de verrouillage ou d’effacement des données des Utilisateurs à caractère personnel (article 17 du RGPD), lorsqu’elles sont inexactes, incomplètes, équivoques, périmées, ou dont la collecte, l'utilisation, la communication ou la conservation est interdite.
● droit de retirer à tout moment un consentement (article 13-2c RGPD).
● droit à la limitation du traitement des données des Utilisateurs (article 18 RGPD).
● droit d’opposition au traitement des données des Utilisateurs (article 21 RGPD).
● droit à la portabilité des données que les Utilisateurs auront fournies, lorsque ces données font l’objet de traitements automatisés fondés sur leur consentement ou sur un contrat (article 20 RGPD).
● droit de définir le sort des données des Utilisateurs après leur mort et de choisir à qui HubNote devra communiquer (ou non) ses données à un tiers qu’ils aura préalablement désigné.

Dès que HubNote a connaissance du décès d’un utilisateur et à défaut d’instructions de sa part, HubNote s’engage à détruire ses données, sauf si leur conservation s’avère nécessaire à des fins probatoires ou pour répondre à une obligation légale.

Si l’Utilisateur souhaite savoir comment HubNote utilise ses Données Personnelles, demander à les rectifier ou s’oppose à leur traitement, l’Utilisateur peut contacter HubNote par écrit à l’adresse suivante :
email : pierremartin.pro@gmail.com
adresse postale : MARTIN Pierre - 97 rue de Paris 93100 Montreuil.
Dans ce cas, l’utilisateur doit indiquer les Données Personnelles qu’il souhaiterait que HubNote corrige, mette à jour ou supprime, en s’identifiant précisément avec une copie d’une pièce d’identité (carte d’identité ou passeport).

Les demandes de suppression de Données Personnelles seront soumises aux obligations qui sont imposées à HubNote par la loi, notamment en matière de conservation ou d’archivage des documents. Enfin, les Utilisateurs de HubNote peuvent déposer une réclamation auprès des autorités de contrôle, et notamment de la CNIL (https://www.cnil.fr/fr/plaintes).

1.4 Non-communication des données personnelles
HubNote s’interdit de traiter, héberger ou transférer les Informations collectées sur ses utilisateurs vers un pays situé en dehors de l’Union européenne ou reconnu comme « non adéquat » par la Commission européenne sans en informer préalablement l'utilisateur. Pour autant, HubNote reste libre du choix de ses sous-traitants techniques et commerciaux à la condition qu’il présentent les garanties suffisantes au regard des exigences du Règlement Général sur la Protection des Données (RGPD : n° 2016-679).

HubNote s’engage à prendre toutes les précautions nécessaires afin de préserver la sécurité des Informations et notamment qu’elles ne soient pas communiquées à des personnes non autorisées. Cependant, si un incident impactant l’intégrité ou la confidentialité des Informations de l'utilisateur est portée à la connaissance de HubNote, celle-ci devra dans les meilleurs délais informer l'utilisateur et lui communiquer les mesures de corrections prises. Par ailleurs HubNote ne collecte aucune « données sensibles ».

Les Données Personnelles de l’Utilisateur peuvent être traitées par des filiales de HubNote et des sous-traitants (prestataires de services), exclusivement afin de réaliser les finalités de la présente politique.

Dans la limite de leurs attributions respectives et pour les finalités rappelées ci-dessus, les principales personnes susceptibles d’avoir accès aux données des Utilisateurs de HubNote sont principalement les agents de notre service client.

1.5 Types de données collectées
Concernant les utilisateurs d’un Site HubNote, nous collectons les données suivantes qui sont indispensables au fonctionnement du service, et qui seront conservées pendant une période maximale de 2 mois mois après la fin de la relation contractuelle:
● nom
● prénom
● email
● nom d'utilisateur (login)

HubNote collecte en outre des informations qui permettent d’améliorer l’expérience utilisateur et de proposer des conseils contextualisés :
● date de naissance
● âge
● à propos
● profession
● nom de l'école
● un/des avatar(s)

Ces  données sont conservées pour une période maximale de 2 mois mois après la fin de la relation contractuelle

2. Notification d’incident
Quels que soient les efforts fournis, aucune méthode de transmission sur Internet et aucune méthode de stockage électronique n'est complètement sûre. Nous ne pouvons en conséquence pas garantir une sécurité absolue. Si nous prenions connaissance d'une brèche de la sécurité, nous avertirions les utilisateurs concernés afin qu'ils puissent prendre les mesures appropriées. Nos procédures de notification d’incident tiennent compte de nos obligations légales, qu'elles se situent au niveau national ou européen. Nous nous engageons à informer pleinement nos utilisateurs de toutes les questions relevant de la sécurité de leur compte et à leur fournir toutes les informations nécessaires pour les aider à respecter leurs propres obligations réglementaires en matière de reporting.

Aucune information personnelle de l'utilisateur du site HubNote n'est publiée à l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l'hypothèse du rachat de HubNote et de ses droits permettrait la transmission des dites informations à l'éventuel acquéreur qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis de l'utilisateur du site HubNote.

Sécurité
Pour assurer la sécurité et la confidentialité des Données Personnelles et des Données Personnelles de Santé, HubNote utilise des réseaux protégés par des dispositifs standards tels que par pare-feu, la pseudonymisation, l’encryption et mot de passe.

Lors du traitement des Données Personnelles, HubNoteprend toutes les mesures raisonnables visant à les protéger contre toute perte, utilisation détournée, accès non autorisé, divulgation, altération ou destruction.

3. Liens hypertextes « cookies » et balises ("tags") internet
Le site HubNote contient un certain nombre de liens hypertextes vers d’autres sites, mis en place avec l’autorisation de HubNote. Cependant, HubNote n’a pas la possibilité de vérifier le contenu des sites ainsi visités, et n’assumera en conséquence aucune responsabilité de ce fait.

Sauf si vous décidez de désactiver les cookies, vous acceptez que le site puisse les utiliser. Vous pouvez à tout moment désactiver ces cookies et ce gratuitement à partir des possibilités de désactivation qui vous sont offertes et rappelées ci-après, sachant que cela peut réduire ou empêcher l’accessibilité à tout ou partie des Services proposés par le site.

3.1. COOKIES
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

4. Droit applicable et attribution de juridiction.
Tout litige en relation avec l’utilisation du site HubNote est soumis au droit français. En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.
						 `}
						</div>
					</Container>
				</Segment>
			</LayoutPage>
		);
	}
}

export default PrivacyPolicy;
