export class TreeNode<T> {
    data: T
    left?: TreeNode<T>
    right?: TreeNode<T>
    constructor(data: T) {
        this.data = data
    }
}

export function TestFunc(): TreeNode<Number> {
    let root = new TreeNode(1)
    root.left = new TreeNode(2)
    root.right = new TreeNode(3)
    root.left.left = new TreeNode(4)
    root.left.right = new TreeNode(5)
    root.right.left = new TreeNode(6)
    root.right.right = new TreeNode(7)
    return root
}

export function traversal<T>(root?: TreeNode<T>) {
    if (root === undefined) {
        return
    }
    console.log(root.data)
    traversal(root.left)
    traversal(root.right)
}
