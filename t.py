import numpy as np

import matplotlib.pyplot as plt


def rotation_relativeX(angle):
    u, v = np.mgrid[0 : 2 * np.pi : 20j, 0 : np.pi : 10j]
    p_x = [0, 1, 1, 0]
    p_y = [0, np.cos(angle * (np.pi / 180)), np.sin(angle * (np.pi / 180)), 0]
    p_z = [1, np.cos(angle * (np.pi / 180)), np.sin(angle * (np.pi / 180)), 1]
    x = p_x[0] * (1 - u) * (1 - v) + p_x[1] * (1 - u) * v + p_x[2] * (1 - v) * u + p_x[3] * u * v
    y = p_y[0] * (1 - u) * (1 - v) + p_y[1] * (1 - u) * v + p_y[2] * (1 - v) * u + p_y[3] * u * v
    z = p_z[0] * (1 - u) * (1 - v) + p_z[1] * (1 - u) * v + p_z[2] * (1 - v) * u + p_z[3] * u * v
    fig = plt.figure()
    ax = fig.add_subplot(111, projection="3d")
    ax.plot_surface(x, y, z, cmap="inferno")
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")

    plt.show()


def rotation_relativeY(angle):
    u, v = np.mgrid[0 : 2 * np.pi : 20j, 0 : np.pi : 10j]
    p_x = [np.cos(angle * (np.pi / 180)), 0, -np.sin(angle * (np.pi / 180)), 0]
    p_y = [0, 1, 0, 1]
    p_z = [np.sin(angle * (np.pi / 180)), 0, np.cos(angle * (np.pi / 180)), 0]
    x = p_x[0] * (1 - u) * (1 - v) + p_x[1] * (1 - u) * v + p_x[2] * (1 - v) * u + p_x[3] * u * v
    y = p_y[0] * (1 - u) * (1 - v) + p_y[1] * (1 - u) * v + p_y[2] * (1 - v) * u + p_y[3] * u * v
    z = p_z[0] * (1 - u) * (1 - v) + p_z[1] * (1 - u) * v + p_z[2] * (1 - v) * u + p_z[3] * u * v
    fig = plt.figure()
    ax = fig.add_subplot(111, projection="3d")
    ax.plot_surface(x, y, z, cmap="inferno")
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")

    plt.show()


def lab_without_rotation():
    u, v = np.mgrid[0 : 2 * np.pi : 20j, 0 : np.pi : 10j]
    p_x = [0, 1, 1, 0]
    p_y = [0, 1, 0, 1]
    p_z = [1, 1, 0, 0]
    x = p_x[0] * (1 - u) * (1 - v) + p_x[1] * (1 - u) * v + p_x[2] * (1 - v) * u + p_x[3] * u * v
    y = p_y[0] * (1 - u) * (1 - v) + p_y[1] * (1 - u) * v + p_y[2] * (1 - v) * u + p_y[3] * u * v
    z = p_z[0] * (1 - u) * (1 - v) + p_z[1] * (1 - u) * v + p_z[2] * (1 - v) * u + p_z[3] * u * v
    fig = plt.figure()
    ax = fig.add_subplot(111, projection="3d")
    ax.plot_surface(x, y, z, cmap="inferno")
    ax.set_xlabel("X")
    ax.set_ylabel("Y")
    ax.set_zlabel("Z")

    plt.show()


print("Hello")
print("Do you want to rotate surface?(y/n)")
a = str(input())
if a == "n":
    lab_without_rotation()
elif a == "y":
    print("Do you want to rotate surface on X?(y/n)")
    b = str(input())
    if b == "y":
        print("Input your angle:")
        ang = float(input())
        rotation_relativeX(ang)
    elif b == "n":
        print("Do you want to rotate surface on Y?(y/n)")
        c = str(input())
        if c == "y":
            print("Input your angle:")
            ang1 = float(input())
            rotation_relativeY(ang1)
        else:
            print("Gooodbye!")
    else:
        print("Gooodbye!")
else:
    print("Gooodbye!")
