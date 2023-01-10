import React from 'react'
import { Sidebar } from 'primereact/sidebar'
import { Card } from 'primereact/card'
import { PanelMenu } from 'primereact/panelmenu'
import { Menubar } from 'primereact/menubar'
import logo from '../../images/crdt.jpg'
import header_brand from '../../images/header.jpg'
import { PrimeIcons } from 'primereact/api'
import { Link, useLocation, useNavigate } from 'react-router-dom'


export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const classactive = "menu-active"

  const items = [
    {
      label: 'Accueil',
      icon: PrimeIcons.HOME,
      className: pathname === "/" && classactive,
      command: () => {
        navigate("/");
      
      }
    },
    {
      label: 'Référentiels',
      icon: PrimeIcons.BOOKMARK,
      expanded:pathname === "/client" || pathname === "/patient" || pathname === "/prescripteur" || pathname === "/examen" ? true : false ,
      items: [
        {
          label: 'Patient',
          icon: PrimeIcons.FILE,
          className: pathname === "/patient" && classactive,
          command: () => {
            navigate("/patient");
          
          }
        },
        {
          label: 'Client',
          icon: PrimeIcons.CREDIT_CARD,
          className: pathname === "/client" && classactive,
          command: () => {
            navigate("/client");
          
          }
        },
        {
          label: 'Prescripteur',
          icon: PrimeIcons.FILE,
          className: pathname === "/prescripteur" && classactive,
          command: () => {
            navigate("/prescripteur");
          
          }
        },
        {
          label: 'Examen',
          icon: PrimeIcons.FILE,
          className: pathname === "/examen" && classactive,
          command: () => {
            navigate("/examen");
          
          }
        }
      ]
    },
    {
      label: 'Patient du jour',
      icon: PrimeIcons.BOOK,
      className: pathname === "/patient_jour" && classactive,
      command: () => {
        navigate("/patient_jour");
      
      }
    },
    {
      label: 'Examen du jour',
      icon: PrimeIcons.USERS,
      className: pathname === "/examen_jour" && classactive,
      command: () => {
        navigate("/examen_jour");
      
      }
    },
    {
      label: 'Facture',
      icon: PrimeIcons.USERS,
      className: pathname === "/facture" && classactive,
      command: () => {
        navigate("/facture");
      
      }
    },
    // {
    //   label: 'Facture',
    //   icon: PrimeIcons.DOLLAR,
    //   expanded:pathname === "/ajout" || pathname === "/details" || pathname === "/impression" || pathname === "/annulation" ? true : false,
    //   items: [
    //     {
    //       label: 'Ajout',
    //       icon: PrimeIcons.CREDIT_CARD,
    //       className: pathname === "/ajout" && classactive,
    //       command: () => {
    //         navigate("/ajout");
          
    //       }
    //     },
    //     {
    //       label: 'Détails',
    //       icon: PrimeIcons.FILE,
    //       className: pathname === "/details" && classactive,
    //       command: () => {
    //         navigate("/details");
          
    //       }
    //     },
    //     {
    //       label: 'Impression',
    //       icon: PrimeIcons.FILE,
    //       className: pathname === "/impression" && classactive,
    //       command: () => {
    //         navigate("/impression");
          
    //       }
    //     },
    //     {
    //       label: 'Annulation',
    //       icon: PrimeIcons.FILE,
    //       className: pathname === "/annulation" && classactive,
    //       command: () => {
    //         navigate("/annulation");
          
    //       }
    //     },
    //   ]
    // },
    {
      label: 'Reglements',
      icon: PrimeIcons.MONEY_BILL,
      expanded:pathname === "/mode_paiement" || pathname === "/saisie_reglement" ? true : false,
      items: [
        {
          label: 'Mode de paiement',
          icon: PrimeIcons.CREDIT_CARD,
          className: pathname === "/mode_paiement" && classactive,
          command: () => {
            navigate("/mode_paiement");
          
          }
        },
        {
          label: 'Saisie reglement',
          icon: PrimeIcons.FILE,
          className: pathname === "/saisie_reglement" && classactive,
          command: () => {
            navigate("/saisie_reglement");
          
          }
        }
      ]
    },
    {
      label: 'Rapport',
      icon: PrimeIcons.BRIEFCASE,
    },
    {
      label: 'Utilisateur',
      icon: PrimeIcons.COG,
    }
  ];


  return (
    <>
      <div className="lg:col-2 md:col-2 sm:col-3 col-3 p-0 " style={{ minHeight: "88vh" }}>

        <Card className='h-full p-0 card-custom'>
          <h1 className='text-center my-0 text-lg pt-2'>Menu</h1>
          <PanelMenu model={items} className="bg-white w-full pt-2" />
        </Card>
      </div>
    </>
  )
}
