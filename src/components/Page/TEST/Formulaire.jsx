import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton'
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
export default function Formulaire() {
    return (
        <div className='text-center'>
            <form className='flex flex-column justify-content-center'>
                <div className="field my-1 flex flex-column px-4">
                    <label htmlFor="username2" className="block">Nom</label>
                    <InputText id="username2" aria-describedby="username2-help" className="p-inputtext-sm p-invalid block" />
                    <small id="username2-help" className="p-error block">Nom requis.</small>
                </div>
                <div className='grid px-4'>
                    <div className="col-6 field my-1 flex flex-column">
                        <label htmlFor="username2" className="block">RC</label>
                        <InputText id="username2" aria-describedby="username2-help" className="p-inputtext-sm p-invalid block" />
                        <small id="username2-help" className="p-error block">RC requis.</small>
                    </div>
                    <div className="col-6 field my-1 flex flex-column">
                        <label htmlFor="username2" className="block">STAT</label>
                        <InputText id="username2" aria-describedby="username2-help" className="p-inputtext-sm p-invalid block" />
                        <small id="username2-help" className="p-error block">STAT requis.</small>
                    </div>
                </div>
                <div className='flex flex-row justify-content-around px-4'>
                    <div>
                        <p className='mt-2'>Basic</p>
                        <div className="field-radiobutton">
                            <RadioButton inputId="city1" name="city" value="Chicago" onChange={(e) => setCity(e.value)} checked={city === 'Chicago'} />
                            <label htmlFor="city1">Chicago</label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton inputId="city2" name="city" value="Los Angeles" onChange={(e) => setCity(e.value)} checked={city === 'Los Angeles'} />
                            <label htmlFor="city2">Los Angeles</label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton inputId="city3" name="city" value="New York" onChange={(e) => setCity(e.value)} checked={city === 'New York'} />
                            <label htmlFor="city3">New York</label>
                        </div>
                        <div className="field-radiobutton">
                            <RadioButton inputId="city4" name="city" value="San Francisco" onChange={(e) => setCity(e.value)} checked={city === 'San Francisco'} />
                            <label htmlFor="city4">San Francisco</label>
                        </div>
                    </div>
                    <div>
                        <p>Check box</p>
                        <div className="col-12 flex gap-2">
                            <Checkbox inputId="cb1" value="New York" onChange={onCityChange} checked={cities.includes('New York')}></Checkbox>
                            <label htmlFor="cb1" className="p-checkbox-label">New York</label>
                        </div>
                        <div className="col-12 flex gap-2">
                            <Checkbox inputId="cb2" value="San Francisco" onChange={onCityChange} checked={cities.includes('San Francisco')}></Checkbox>
                            <label htmlFor="cb2" className="p-checkbox-label">San Francisco</label>
                        </div>
                        <div className="col-12 flex gap-2">
                            <Checkbox inputId="cb3" value="Los Angeles" onChange={onCityChange} checked={cities.includes('Los Angeles')}></Checkbox>
                            <label htmlFor="cb3" className="p-checkbox-label">Los Angeles</label>
                        </div>
                    </div>
                    <div>

                        <h5>Preselection</h5>
                        <InputSwitch checked={true} />
                    </div>
                </div>
                <div className='px-4 my-2 flex flex-column gap-2 justify-content-center'>
                    <label htmlFor="dropdown">Dropdown</label>
                    <Dropdown inputId="dropdown" options={citiess} optionLabel="name" className="p-invalid" />
                </div>
                <div className='flex mt-3 justify-content-end'>
                    <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary' label='Enregistrer' />
                </div>
            </form>
        </div>
    )
}
