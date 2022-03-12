// use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

mod data;
mod gamebase;
mod rigid;

#[global_allocator]
static ALLOC: WeeAlloc = WeeAlloc::INIT;
