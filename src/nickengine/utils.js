var Utils = {
    // Checks if a point is inside a polygon
    // nvert - Number of vertices in the polygon.
    // vertx, verty - Arrays containing the x- and y-coordinates of the polygon's vertices.
    // testx, testy - X- and y-coordinate of the test point
    // LAST POINT must repeat FIRST POINT
    pnpoly : function( nvert, vertx, verty, testx, testy ) {
        var i,j,c = false;
        for(i=0, j=nvert-1; i<nvert; j=i++) {
            if((( verty[i] > testy ) != ( verty[j] > testy ) ) &&
                ( testx < ( vertx[j] - vertx[i] ) * ( testy - verty[i] ) / ( verty[j] - verty[i] ) + vertx[i] ) ) {
                    c = !c;
            }
        }
        return c;
    },

    pointInRect: function (rx,ry,w,h,x,y){
        return (x>=rx && x<=rx+w && y>=ry && y<=ry+h);
    },

    drawRect: function(x, y, w, h, col) {
        if (col === undefined) {
            col = "#000000"
        }
        context.fillStyle = col;
        context.fillRect(x,y,w,h);
    },

    drawEllipse: function(ctx, x, y, w, h) {
      var kappa = .5522848,
          ox = (w / 2) * kappa, // control point offset horizontal
          oy = (h / 2) * kappa, // control point offset vertical
          xe = x + w,           // x-end
          ye = y + h,           // y-end
          xm = x + w / 2,       // x-middle
          ym = y + h / 2;       // y-middle

      ctx.moveTo(x, ym);
      ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
      ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
      ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
      
    },

    drawEllipseByCenter: function(ctx, cx, cy, w, h) {
        this.drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
    },

    drawHorizontalLine: function (x, y1, y2, col) {
        context.strokeStyle = col;
        context.beginPath();
        context.moveTo(x+.5,y1);
        context.lineTo(x+.5,y2);
        context.stroke();
    },

    drawVerticalLine: function (x1, x2, y, col) {
        context.strokeStyle = col;
        context.beginPath();
        context.moveTo(x1,y+.5);
        context.lineTo(x2,y+.5);
        context.stroke();
    },
};