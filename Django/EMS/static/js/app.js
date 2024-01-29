let elevators = $("#elevators")
let requestedStatus = false     //variable to mark whether there is requested floor or not in requests list

//Operation to get elevators set already when system runs
$(document).ready(() => getElevators())

/**
 * Function to get elevators set now
 */
const getElevators = async () => {
    let requests = await getReqeusts() //To get requests in request list
   
    //Api to get elevators set from backend
    await $.getJSON('api/elevators/', (data) => {
        elevators.children('.elevator').remove() //Delete old elevators

        if (data.results && data.results.length) {
            for (let i = 0; i < data.results.length; i++) {
                let result = data.results[i]
                let id = result.id
                let current_floor = result.current_floor
                let door_open = result.door_open
                let request = requests.results && requests.results.length ? requests.results.filter((req) => req.elevator == id) : ''

                //Variable to decide floor that elevator has to go up or down
                let to_go = request && request.length ? request[0].requested_floor : 0 

                //Variable to mark whether elevator is in maintenance or not
                let maintenanceStatus = result.in_maintenance ? 
                    `<div class="elevator-text">Maintenance: </div><div class="item item-circle item-red"><i class="fa fa-refresh"></i></div>` : 
                    `<div class="elevator-text">Maintenance: </div><div class="item item-circle item-red"><i class="fa fa-close"></i></div>`

                //Variable to mark whether elevator is operational or not
                let operationalStatus = result.operational ? 
                    `<div class="elevator-text">Operational: </div><div class="item item-circle item-success"><i class="fa fa-desktop"></i></div>` : 
                    `<div class="elevator-text">Operational: </div><div class="item item-circle item-default"><i class="fa fa-close"></i></div>`
                
                let moving_up = parseInt(current_floor) - parseInt(to_go)
                
                //Variablt to decide whether elevator has to go up or down
                let movingStatus = moving_up != 0 && parseInt(to_go)? 
                    moving_up < 0 ?
                        `<div class="elevator-text">Moving: </div><div class="item item-circle item-success"><i class="fa fa-arrow-up"></i></div>` : 
                        `<div class="elevator-text">Moving: </div><div class="item item-circle item-success"><i class="fa fa-arrow-down"></i></div>` :
                    `<div class="elevator-text">Moving: </div>
                    <div class="item item-circle item-default"><i class="fa fa-close"></i></div>`
                
                //items for each elevators include current_floor, floor_to_go, maintenance, operational,    movingup and two buttons.
                const eleItem = door_open ?
                    `<div class="elevator">
                        <div class="elevator-header" onclick="door_control({id:${id}, type:'f'})" id='elevator${id}' index='${id}'><i class="fa fa-unlock"></i>&nbsp;&nbsp;Elevator${id}</div>
                        <div class="elevator-body">
                            <div class='elevator-item'>
                                <div class='elevator-text'>Current floor: </div>
                                <div class="item item-circle item-blue">${current_floor}</div>
                            </div>
                            <div class='elevator-item'>
                                <div class="elevator-text">To go: </div>
                                <div class="item item-circle item-orange">${to_go}</div>
                            </div>
                            <div class='elevator-item'>
                                ${maintenanceStatus}
                            </div>
                            <div class="elevator-item">
                                ${operationalStatus}
                            </div>
                            <div class="elevator-item">
                                ${movingStatus}
                            </div>
                        </div>
                        <div class="elevator-footer">
                            <button id="runSystem${id}" class="btn  btn-success" onclick="run_system({id:${id},requested_floor:${to_go},current_floor:${current_floor},in_maintenance:${result.in_maintenance},operational:${result.operational}})">Start</button>
                            <button class="btn btn-primary" onclick="edit_system({id:${id},requested_floor:${to_go},current_floor:${current_floor},in_maintenance:${result.in_maintenance},operational:${result.operational}})"><i class="fa fa-save"> Edit</i></button>
                        </div>
                    </div>` :
                    `<div class="elevator">
                        <div class="elevator-header" onclick='door_control({id:${id}, type:"t"})' id='elevator${id}' index='${id}'><i class="fa fa-lock"></i>&nbsp;&nbsp;Elevator${id}</div>
                    </div>`
                $(eleItem).appendTo('#elevators');
            }
        }
    });
}

/**
 * Function to get requests set for each elevator
 * @returns @Object : { id: Int, elevator_id:Int, requested_floor: Int, created_at: Date }
 */
const getReqeusts = async () => await $.getJSON('api/requests/', (data) => data)

/**
 * Function to send the post request for control the door to the server
 * @param {Object} data {id: int, type: char}
 * @returns 
 */
const door_control = (data) => {
    if (!data.id || !data.type) return
    else {
        $.post('/door/', { id: data.id, type: data.type }, () => location.reload())
        .fail(() => alert('Error!'));
    }
}

/**
 * Function to show the window to edit the elevator system
 * @param {Object} data | {id: int, current_floor: int, in_maintenance: bool, requested_floor: int}
 * @returns 
 */
const edit_system = (data) => {
    if (!data) return
    else {
        if (data.requested_floor) requestedStatus = true
        else requestedStatus = false
        document.querySelector("#elevatorId").innerHTML = '! Update elevator system' + data.id
        document.querySelector("#editId").value = data.id
        document.querySelector("#currentFloor").innerHTML = data.current_floor
        document.querySelector("#editToFloor").value = data.requested_floor
        document.querySelector("#editMaintenance").value = data.in_maintenance
        document.querySelector("#editOperational").value = data.operational
        $("#updateApp").fadeIn()
    }
}

/**
 * To function to send post request to run given elevator 
 * @param {Objeact} data | {id: int, operational: bool, requested_floor: int}
 * @returns 
 */
const run_system = async (data) => {
    if (!data.operational) {
        alert("This elevator isn't operational. This will be operational then, try again.")
        return
    } else if (data.in_maintenance) {
        alert('This is in maintenance. After that, try again.')
        return
    } else if (parseInt(data.current_floor) - parseInt(data.requested_floor) == 0 || parseInt(data.requested_floor) == 0) {
        alert('Destination is not clear. Please check out.')
        return
    } else {
        moving_up = parseInt(data.current_floor) - parseInt(data.requested_floor) < 0 ? true : false
        current_floor = data.requested_floor //Floor to reach
        await $.post('/run/', { id: data.id, current_floor, moving_up })
        .fail(() => alert('Error!'));
    }
    document.querySelector("#runSystem"+data.id).setAttribute("class", "btn btn default")
    document.querySelector("#runSystem"+data.id).innerHTML = 'Stop'
    document.querySelector("#runSystem"+data.id).setAttribute("onclick", "location.reload()")
}

//Handler to edit the selected eleavtor 
$("#editSaveInfoBtn").click(() => {
    let id = document.querySelector("#editId").value
    let to_floor = document.querySelector("#editToFloor").value
    let in_maintenance = document.querySelector("#editMaintenance").value
    let operational = document.querySelector('#editOperational').value

    if (!id) return
    else if (to_floor < 0) {
        alert("Please input again")
        document.querySelector("#editToFloor").focus()
    }
    else {
        $.post('/edit/', { id, to_floor, in_maintenance, operational, edit_type: requestedStatus }, () => location.reload())
        .fail(() => alert('Error!'));
    }
})

//Hander to show the window to initialize the elevator system
$("#appFormatBtn").click(() => {
    $("#formatApp").fadeIn()
    $("#numElevator").focus()
})

//Hander to hide the window to initialize the elevator system
$("#formatCloseBtn").click(() => $("#formatApp").fadeOut())

//Hander to hide the window to edit the elevator system
$("#editCloseBtn").click(() => $("#updateApp").fadeOut())

//Hander to initialize the elevator system
$("#formatSaveInfoBtn").click(() => {
    let num = document.querySelector("#numElevator").value //Variable to mark number of elevators to set

    if (!num) {
        alert("Please input value")
        $("#numElevator").focus()
    } else {
        $.post('/init/', { num }, () => location.reload())
        .fail(() => alert('Error!'));
    }
})
