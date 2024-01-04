
import { TicketControl } from "../models/ticket-control.js";

const ticketcontrol = new TicketControl();
ticketcontrol.init();


const socketController = (socket) => {
    
    socket.emit('ultimo-ticket', ticketcontrol.ultimo );
    socket.emit('estado-actual', ticketcontrol.ultimos4);

    socket.emit('tickets-pendientes', ticketcontrol.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketcontrol.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes', ticketcontrol.tickets.length);
    })

    socket.on('atender-ticket', ({ escritorio }, callback) =>  {
        
        if( !escritorio ){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketcontrol.atenderTicket(escritorio);

        socket.broadcast.emit('estado-actual', ticketcontrol.ultimos4);
        socket.emit('tickets-pendientes', ticketcontrol.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketcontrol.tickets.length);


        if ( !ticket ){
            callback({
                ok:false,
                msg:'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })

}

export { socketController }

