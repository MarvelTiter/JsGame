use crate::data::vector::Vector2;
use crate::gamebase::game_object::GameObjectBase;
use wasm_bindgen::{prelude::*, JsObject, JsCast};

pub trait GameObject {
    
}

pub struct RigidBase {
    pub id: i32,
    pub force: Vector2,
    pub parts: Vec<RigidBase>,
    pub parent: Box<dyn GameObject>,
    pub velocity: Vector2,
    pub offset: Vector2,
    pub motion: f64,
    pub speed: f64,
    pub angular_speed: f64,
    pub angular_velocity: f64,
    pub torque: f64,
    pub mass: f64,
    pub inv_mass: f64,
    pub inertia: f64,
    pub inv_inertia: f64,
    pub density: f64,
    pub friction: f32,
    pub friction_static: f32,
    pub friction_air: f32,
    pub restitution: f32,
    pub slop: f32,
    pub total_relates: i32,
    pub is_static: bool,
    pub is_sleeping: bool,
    pub time_scale: f32,
    pub position_impulse: Vector2,
    pub area: f64,
    pub target: Box<dyn GameObject>,
}

// impl JsObject for RigidBase {}
// impl  JsCast for RigidBase {
    
// }
