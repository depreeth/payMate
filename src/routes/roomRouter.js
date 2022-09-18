const express = require('express')
const bcrypt = require('bcryptjs')

const auth = require('../middlewares/auth')
const User = require('../mongo/models/users')
const Expense = require('../mongo/models/expense')
const Room = require('../mongo/models/room')
const Total = require('../mongo/models/total')


const router = new express.Router()

// create room
router.post('/room/create', auth, async (req, res) => {
    console.log("hi")
    const user = req.user
    // try {
    const room = new Room(req.body)
    console.log(user._id)
    room.users.push(user._id)
    await room.save()

    const ourUser = await User.findById(user._id)
    ourUser.rooms.push(room._id)
    await ourUser.save()
    console.log(ourUser)

    const total = new Total({
        room: room._id,
        user: user._id
    })
    await total.save()

    res.send(room)
    // } catch (error) {
    //     res.status(500).send(error)
    // }
})

router.post('/room/join', auth, async (req, res) => {
    console.log('hi', req.user)
    const user = req.user

    // try {
        let name
        let password

        if (req.body.join_link) {
            const link = req.body.join_link
            const roomIndex = link.search("Room=") + 5
            const passwordIndex = link.search("Password=") + 9
            const firstAmp = link.indexOf("&")
            const lastAmp = link.lastIndexOf("/")
            name = link.slice(roomIndex, firstAmp)
            password = link.slice(passwordIndex, lastAmp)
            console.log("roomIndex", roomIndex, "passwordIndex", passwordIndex, "firstAmp", firstAmp, "lastAmp", lastAmp, "name", name, "password", password)
            // res.send({room, pass})

            const room = await Room.findOne({ name })
            console.log("ROOM", room)
            if (!room) {
                res.status(404).send("Room not found")
                // console.log("no")
            }
            else {
                const ourUser = await User.findById(user._id)
                const isMatch = await bcrypt.compare(password, room.password)
                console.log(isMatch)
                // if (room.password === password) {
                if (!isMatch) {
                    // console.log("yes")
                    if (!room.users.includes(user._id)) {
                        room.users.push(user._id)
                        await room.save()

                        ourUser.rooms.push(room._id)
                        await ourUser.save()

                        const total = new Total({
                            room: room._id,
                            user: user._id,
                            total: 0
                        })
                        await total.save()
                    }
                    res.send({ room, user })
                }
                else {
                    res.status(404).send("Room not found")
                }
            }

        }

        else {
            name = req.body.name
            password = req.body.password

            const room = await Room.findOne({ name })
            if (!room) {
                res.status(404).send("Room not found")
            }
            else {
                const ourUser = await User.findById(user._id)
                // if (room.password === password) {
                const isMatch = await bcrypt.compare(req.body.password, room.password)
                console.log(isMatch)
                if (!isMatch) {

                    if (!room.users.includes(user._id)) {
                        room.users.push(user._id)
                        await room.save()

                        ourUser.rooms.push(room._id)
                        await ourUser.save()

                        const total = new Total({
                            room: room._id,
                            user: user._id,
                            total: 0
                        })
                        await total.save()
                    }
                    res.send({ room, user })
                }
                else {
                    res.status(404).send("Room not found")
                }
            }
        }



    // } catch (error) {
    //     res.status(500).send(error)
    // }
})

router.get('/:room/users', auth, async (req, res) => {
    // console.log(req.params.room)
    const room = await Room.findOne({ name: req.params.room })

    if (room) {
        const users = await room.populate('users')
        // console.log(users)
        const userNames = []
        for (let i = 0; i < users.users.length; i++) {
            // res.send(rooms.rooms[i])
            userNames.push(users.users[i].name)
        }
        res.send({ room: room.name, userNames })
        // console.log({ room: room.name, userNames })
    }
    else {
        res.status(404).send("No room found")
    }
})

router.get('/:room/analyze', auth, async (req, res) => {
    const room = await Room.findOne({ name: req.params.room })

    if (!room) {
        return res.status(404).send("Room not found")
    }
    // const expense = await Expense.find({ room: room._id }).populate('owner')
    const expense = await Expense.find({ room: room._id })
    const total = await Total.find({ room: room._id }).populate("room").populate("user")
    console.log(req.user)
    // const user = req.user
    res.send({ expense, total })
})

router.patch('/:room/settleTransaction', auth, async (req, res) => {
    try {
        const room = await Room.findOne({ name: req.params.room })
        if (!room) {
            return res.status(404).send("Room not found")
        }

        // const total = await Total.find({ room: room._id })

        // if(req.body.command === "settleAllTransactions(aDmin)"){
        //     total.forEach( async(e)=>{
        //         e.total = 0
        //         await e.save()
        //     })
        //     return res.send(total)
        // }

        // const data = {
        //     payer: req.body.payer,
        //     receiver: req.body.receiver,
        //     amount: req.body.amount
        // }

        // console.log("data", data)

        const payer = await Total.findOne({ $and: [{ room: room._id }, { _id: req.body.payer }] })
        const receiver = await Total.findOne({ $and: [{ room: room._id }, { _id: req.body.receiver }] })
        console.log({ "payer": payer, "receiver": receiver })
        payer.total = payer.total + Math.abs(req.body.amount)
        receiver.total = receiver.total - Math.abs(req.body.amount)
        await payer.save()
        await receiver.save()

        const total = await Total.find({ room: room._id })

        console.log("tot", total)
        let avg = 0
        total.forEach((e) => {
            avg += e.total
        })
        avg = avg / total.length

        console.log("avg", avg)

        let count = 0
        total.forEach((e) => {
            if (Math.round(e.total) === Math.round(avg)) {
                count += 1
            }
        })
        console.log("cnt", count)
        console.log("len", total.length)

        if (count === total.length) {
            const total = await Total.updateMany({ total: 0 })
            console.log("xxxxx", total)
            return res.send(total)
        }

        res.send({ total, payer, receiver })

    } catch (error) {
        res.status(500).send(error)
    }
})



module.exports = router