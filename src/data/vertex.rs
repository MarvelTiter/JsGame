use crate::data::vector::Vector2;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Copy, Clone)]
pub struct Vertex {
    pub point: Vector2,
    pub index: i32,
}

#[wasm_bindgen]
impl Vertex {
    pub fn new(point: Vector2, index: i32) -> Vertex {
        Vertex { point, index }
    }
    pub fn cross(&self, vec: &Vector2) -> f64 {
        self.point.cross(vec)
    }
    pub fn dot(&self, vec: &Vector2) -> f64 {
        self.point.dot(vec)
    }
    pub fn add(&self, vec: &Vector2) -> Vector2 {
        self.point.add(vec)
    }
    pub fn sub(&self, vec: &Vector2) -> Vector2 {
        self.point.sub(vec)
    }
}
