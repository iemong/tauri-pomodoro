import React, {useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {open} from '@tauri-apps/plugin-dialog';
import "./App.css";
import {Button} from "@/components/ui/button.tsx";
import { Coffee, Eye, Pause, Play, X} from "lucide-react";
import Database from "@tauri-apps/plugin-sql";
import {appConfigDir} from "@tauri-apps/api/path";

const db = await Database.load('sqlite:pomodoro.db');


function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", {name}));
    }

    async function simpleCommand() {
        await invoke('simple_command')
    }

    async function commandWithMessage() {
        await invoke('command_with_object', {message: {field_str: 'some message', field_u32: 12}}).then(message => {
            console.log('command_with_messge', message)
        })
    }

    async function commandWithError() {
        for (let arg of [1, 2]) {
            invoke('command_with_error', {arg}).then(message => {
                console.log('command_with_error', message)
            }).catch(message => {
                console.error('command_with_error', message)
            })
        }
    }

    function openDialog() {
        open().then(files => console.log(files))
    }

    async function add() {
        const result = await db.execute(
            "INSERT into pomodoro_sessions (start_time, duration, task) VALUES ($1, $2, $3)",
            [new Date(), 25, "Work"]
        );
        console.log(result)
    }

    async function get() {
        const appConfigDirPath = await appConfigDir();
        const result = await db.select("SELECT * from pomodoro_sessions");
        console.log(result, appConfigDirPath)
    }

    return (
        <main className="container">
            <p className={'tracking-wider flex gap-1 items-center text-sm'}><Eye size={14}/>FOCUS</p>
            <p className={'tracking-wider flex gap-1 items-center text-sm'}><Coffee size={14}/>BREAK</p>
            <Button variant={'default'} size={"icon"}><Play aria-label={'Play'}/></Button>
            <Button variant={'default'} size={"icon"}><Pause aria-label={'Pause'}/></Button>
            <Button variant={'default'} size={"icon"}><X aria-label={'Stop'}/></Button>

            <Button variant={'default'} size={"icon"} onClick={add}>Add DB</Button>
            <Button variant={'default'} size={"icon"} onClick={get}>GET</Button>
        </main>
    );
}

export default App;
