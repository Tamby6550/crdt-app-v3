import React, { useState } from 'react';

function Formulaire() {
  let idCounter = 1;

  function generateRandomData() {
    const dataage = [
      { value: '14ans - 18ans', label: '14ans - 18ans', chance: { Lyceen: 8, Etudiant: 2, Autre: 0.5 } },
      { value: '18ans - 28ans', label: '18ans - 28ans', chance: { Lyceen: 3, Etudiant: 8, Autre: 6 } },
      { value: '+ 28ans', label: '+ 28ans', chance: { Lyceen: 0.8, Etudiant: 5, Autre: 9 } },
    ];

    const dataactif = [
      { value: 'Chomeur', label: 'Chomeur', chance: 0.5 },
      { value: 'Entrepreneur', label: 'Entrepreneur', chance: 1.5 },
      { value: 'TP', label: 'Travailleur Professionnel', chance: 1 },
      { value: 'Lyceen', label: 'Lyceen', chance: 7 },
      { value: 'Etudiant', label: 'Etudiant', chance: 10 },
      { value: 'Doctorant', label: 'Doctorant', chance: 4 },
      { value: 'Professeur', label: 'Professeur', chance: 1 },
      { value: 'Autre..', label: 'Autre..', chance: 7 },
    ];

    const datasexe = [
      { value: 'M', label: 'Masculin' },
      { value: 'F', label: 'Feminin' },
    ];
    const user = [
      { user_name: 'joeline rasoanandrasana', mdp: 'joel2023' },
      { user_name: 'Vatosoa', mdp: 'vatosoa2023' },
      { user_name: 'Tokitiana Herilala R', mdp: 'toki2023' },
      { user_name: 'Rado antenaina', mdp: 'rado2023' },
      { user_name: 'Jessica', mdp: 'jessi2023' },
    ];

    const randomData = [];

    for (let i = 0; i < 300; i++) {
      const randomIndex = Math.floor(Math.random() * user.length);
      const randomUser = user[randomIndex];

      let totalChance = 0;
      dataactif.forEach((item) => (totalChance += item.chance));

      let randomNumber = Math.random() * totalChance;
      let selectedActif = null;
      let accumulatedChance = 0;

      for (let j = 0; j < dataactif.length; j++) {
        accumulatedChance += dataactif[j].chance;
        if (randomNumber < accumulatedChance) {
          selectedActif = dataactif[j];
          break;
        }
      }

      if (selectedActif && selectedActif.chance === 0) {
        continue; // Ignorer l'itération si la chance est de 0
      }

      let selectedAge = null;
      for (const age of dataage) {
        const chance = age.chance[selectedActif.value] || age.chance.Autre;
        if (Math.random() < chance / 10) {
          selectedAge = age;
          break;
        }
      }

      const randomSexe = datasexe[Math.floor(Math.random() * datasexe.length)];

      const startDate = new Date(2023, 4, 18); // 18 mai 2023
      const endDate = new Date(2023, 4, 20); // 19 mai 2023

      const randomTimestamp = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const randomDate = new Date(randomTimestamp);

      // Vérifier si la date générée est le 20 mai et ajuster en conséquence
      if (randomDate.getDate() === 20) {
        randomDate.setDate(19);
      }

      // randomDate.setHours(Math.floor(Math.random() * 4) + 9); //9h-11 Matin
      randomDate.setHours(Math.floor(Math.random() * 5) + 14); //13h-15 Après midi
      randomDate.setMinutes(Math.floor(Math.random() * 60));
      randomDate.setSeconds(Math.floor(Math.random() * 60));
      randomDate.setMilliseconds(0);

      const newData = {
        actif: selectedActif.value,
        age: selectedAge ? selectedAge.value : '18ans - 28ans',
        date: randomDate.toISOString(),
        id: '70pGwe05L5hwl5BQDCBJ',
        id_vist: idCounter,
        mdp: randomUser.mdp,
        user_name: randomUser.user_name,
        sexe: randomSexe.value,
      };

      randomData.push(newData);
      idCounter++;
    }

    return randomData;
  }

  // Exemple d'utilisation
  const randomData = generateRandomData();
  console.log(randomData);

  return (
    <div>
      <h1>Correction automatique des fautes d'orthographe</h1>

    </div>
  );
}

export default Formulaire;