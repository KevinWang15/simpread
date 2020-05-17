import {browser} from "./service/browser";

console.log("=== simpread contentscripts load ===")

import './assets/css/simpread.css';
import './assets/css/setting.css';
import 'notify_css';
import Notify from 'notify';

import {focus} from 'focus';
import * as read from 'read';
import * as highlight from 'highlight';
import {storage, STORAGE_MODE as mode} from 'storage';

import PureRead from 'puread';
import * as puplugin from 'puplugin';

let pr,                           // pure read object
    is_blacklist = false,
    current_url = location.href; // current page url ( when changed page changed )

$.fn.sreffect = $.fn.velocity == undefined ? $.fn.animate : $.fn.velocity; // hack code for firefox

function entry(current, other, ...str) {
    if (other.Exist(false)) {
        new Notify().Render(`请先退出${str[0]}模式，才能进入${str[1]}模式。`);
        return false;
    }
    if (current.Exist(true)) return false;
    return true;
}

function getCurrent(mode) {
    if (mode && storage.VerifyCur(mode)) {
        (!pr || !pr.Exist()) && pRead();
        storage.Getcur(mode, pr.current.site);
    }
}

function pRead() {
    pr = new PureRead(storage.sites);
    pr.cleanup = storage.read.cleanup == undefined ? true : storage.read.cleanup;
    pr.pure = storage.read.pure == undefined ? false : storage.read.pure;
    pr.AddPlugin(puplugin.Plugin());
    pr.Getsites();
    storage.puread = pr;
    console.log("current puread object is   ", pr)
}

function readMode() {
    console.log("=== simpread read mode active ===")

    if (!entry(read, focus, "聚焦", "阅读")) return;
    getCurrent(mode.read);

    if (storage.current.site.name != "") {
        read.Render();
    } else if (pr.state == "temp" && pr.dom) {
        read.Render();
    } else {
        new Notify().Render("<a href='http://ksria.com/simpread/docs/#/词法分析引擎?id=智能感知' target='_blank' >智能感知</a> 正文失败，请移动鼠标，并通过 <a href='http://ksria.com/simpread/docs/#/手动框选' target='_blank' >手动框选</a> 的方式生成正文。");
        read.Highlight().done(dom => {
            const rerender = element => {
                pr.TempMode(mode.read, dom);
                read.Render();
            };
            storage.current.highlight ?
                highlight.Control(dom).done(newDom => {
                    rerender(newDom);
                }) : rerender(dom);
        });
    }
}

window.EnterReadMode = readMode;