from matplotlib import pyplot as plt
import numpy

fig, ax = plt.subplots()

delay = [ 4, 6, 8, 10, 12, 14, 16, 18 ]
channels = [4,4,5,6,3,2,1,0]
ax.plot(delay, channels, label = "2 Diodes")

delay = [6,8,10,12,14,16,18,20,22,24,26]
channels = [8,12,18,25,21,18,13,6,3,1,0]
ax.plot(delay, channels, label = "3 Diodes")

delay = [8,10,12,14,16,18,20,22,24,26,28,30,32,34]
channels = [16,32,56,88,97,100,90,64,43,24,10,4,1,0]
ax.plot(delay, channels, label = "4 Diodes")

delay = [10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42]
channels = [32,80,160,280,370,441,465,415,340,245,151,85,40,15,5,1,0]
ax.plot(delay, channels, label = "5 Diodes")

ax.legend()
ax.set_yscale("log")
#ax.set_xscale("log")

ax.set_ylabel("Available Channels")
ax.set_xlabel("Delay / Game Ticks")
ax.grid("both", linestyle = "--")


plt.show()