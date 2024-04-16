import matplotlib.pyplot as plt
import numpy as np
from matplotlib.widgets  import RectangleSelector
"""
xdata = np.linspace(0,9*np.pi, num=301)
ydata = np.sin(xdata)*np.cos(xdata*2.4)

fig, (ax1,ax2) = plt.subplots(nrows=2,ncols=1)
line, = ax1.plot(xdata, ydata)
point, = ax1.plot([],[], marker="o", color="crimson")
text = ax1.text(0,0,"")

line2, = ax2.plot([],[])


def line_select_callback(eclick, erelease):
    x1, y1 = eclick.xdata, eclick.ydata
    x2, y2 = erelease.xdata, erelease.ydata

    mask= (xdata > min(x1,x2)) & (xdata < max(x1,x2)) & \
          (ydata > min(y1,y2)) & (ydata < max(y1,y2))
    xmasked = xdata[mask]
    ymasked = ydata[mask]
    update_line(line2,xmasked,ymasked)
    

def update_line(l, xdata_new,ydata_new):
    l.set_xdata(xdata_new)
    l.set_ydata(ydata_new)
    plt.draw()


rs = RectangleSelector(ax1, line_select_callback,
                       useblit=False, button=[1], 
                       minspanx=5, minspany=5, spancoords='pixels', 
                       interactive=True)

plt.show()


"""

from numpy import pi, sin
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider, Button, RadioButtons, TextBox, RectangleSelector

def signal(amp, freq):
    return amp * sin(2 * pi * freq * t)

axis_color = 'lightgoldenrodyellow'

fig = plt.figure()
ax = fig.add_subplot(111)

# Adjust the subplots region to leave some space for the sliders and buttons
fig.subplots_adjust(left=0.25, bottom=0.25)

t = np.arange(0.0, 1.0, 0.001)
amp_0 = 5
freq_0 = 3
xdata = t
ydata = signal(amp_0, freq_0)
# Draw the initial plot
# The 'line' variable is used for modifying the line later
[line] = ax.plot(xdata, ydata, linewidth=2, color='red')
ax.set_xlim([0, 1])
ax.set_ylim([-10, 10])

# Add two sliders for tweaking the parameters

# Define an axes area and draw a slider in it
amp_slider_ax  = fig.add_axes([0.25, 0.15, 0.65, 0.03], facecolor=axis_color)
amp_slider = Slider(amp_slider_ax, 'Amp', 0.1, 10.0, valinit=amp_0)

# Draw another slider
freq_slider_ax = fig.add_axes([0.25, 0.1, 0.65, 0.03], facecolor=axis_color)
freq_slider = Slider(freq_slider_ax, 'Freq', 0.1, 30.0, valinit=freq_0)

text_box_ax = fig.add_axes([0.5, 0.025, 0.1, 0.04])
text_box = TextBox(text_box_ax, 'Init', textalignment="center")
xwr = 4

# Define an action for modifying the line when any slider's value changes
def sliders_on_changed(val):
    text_box.set_val(str(val))
    line.set_ydata(signal(amp_slider.val, freq_slider.val))
    fig.canvas.draw_idle()
    print(xwr)
   
amp_slider.on_changed(sliders_on_changed)
freq_slider.on_changed(sliders_on_changed)

# Add a button for resetting the parameters
reset_button_ax = fig.add_axes([0.8, 0.025, 0.1, 0.04])
reset_button = Button(reset_button_ax, 'Reset', color=axis_color, hovercolor='0.975')
def reset_button_on_clicked(mouse_event):
    freq_slider.reset()
    amp_slider.reset()
reset_button.on_clicked(reset_button_on_clicked)

# Add a text box 



# Add a set of radio buttons for changing color
color_radios_ax = fig.add_axes([0.025, 0.5, 0.15, 0.15], facecolor=axis_color)
color_radios = RadioButtons(color_radios_ax, ('red', 'blue', 'green'), active=0)
def color_radios_on_clicked(label):
    line.set_color(label)
    fig.canvas.draw_idle()
color_radios.on_clicked(color_radios_on_clicked)

def line_select_callback(eclick, erelease):
    x1, y1 = eclick.xdata, eclick.ydata
    x2, y2 = erelease.xdata, erelease.ydata
    mask= (xdata > min(x1,x2)) & (xdata < max(x1,x2)) & \
          (ydata > min(y1,y2)) & (ydata < max(y1,y2))
    xmasked = xdata[mask]
    ymasked = ydata[mask]



rs = RectangleSelector(ax, line_select_callback,
                       useblit=False, button=[1], 
                       minspanx=5, minspany=5, spancoords='pixels', 
                       interactive=True)

plt.show()