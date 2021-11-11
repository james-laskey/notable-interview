import React, {useState,useEffect} from "react";
import ReactDOM from "react-dom";


export default function Layout(props){
    let [physicians, setPhysicians] = useState(null)
    let [selectedPhysician, selectThisPhysician] = useState(null)

    function handleSelect(doctor){
        console.log(doctor)
    }
    useEffect(()=>{
        if(!physicians){
            fetch('/getPhysicians',{
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json',
                }
            })
            .then(response=>{return response.json()})
            .then(json=>{
                if (json.physicians){
                    let doctors = json.physicians
                    let phys = []
                    setPhysicians(doctors)
                    for(var i=0;i<doctors.length;i++){
                    console.log(doctors[i])
                        let doc = (<li  ><button value={doctors[i]['pid']} onClick={e=>{selectThisPhysician(e.target.value)}}>{doctors[i]['lastname']+','+doctors[i]['firstname']}</button></li>)
                        phys.push(doc)
                    }
                    function Results(props){
                        return(
                            <ul id='physicians-selector'>{phys}</ul>
                        )
                    }

                    ReactDOM.render(<Results/>, document.getElementById('physicians-selector'))
                }
            })
        }
    }, [physicians])
    useEffect(()=>{
        if(selectedPhysician){
            fetch('/getAppointments?pid='+selectedPhysician, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json',
                }
            })
            .then(response=>{return response.json()})
            .then(json=>{
                let apts = []
                let appointments = json.appointments
                if(appointments){
                    for (var a = 0; a <appointments.length; a++){
                        let apt = (<li id='apt'>
                            <section>
                                {appointments[a]['patientname']}
                            </section>
                            <section>
                                {appointments[a]['timeofapt']}
                            </section>
                            <section>
                                {appointments[a]['typeofapt']}
                            </section>
                        </li>)
                        apts.push(apt)
                    }
                    function Appointments(props){
                        return(
                            <section>

                                <section style={{display:'inline-flex', color: 'blue', fontWeight:'600'}}>
                                    <p>#</p><p>Name</p><p>Time</p><p>Kind</p>
                                </section>
                                <ol>
                                    {apts}
                                </ol>
                            </section>
                        )
                    }
                    ReactDOM.render(<Appointments/>, document.getElementById('appointments-selector'))
                }
            })
        }

    }, [selectedPhysician])

    return(
        <main>
            <aside id='physicians'>
                <h1>Physicians</h1>
                <div id='physicians-selector'>

                    <button id='logout'>Logout</button>
                </div>
            </aside>
            <section id='appointments-selector'>
            </section>
        </main>
    )
}
