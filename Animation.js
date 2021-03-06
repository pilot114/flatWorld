// сделать конструктор, чтобы только один раз передавать сюда world

function Anim(lifer, world, name, vector) {
    // обычно dx и dy высчитываем из вектора

    // физическое ограничение - нельзя сильно накладывать объекты друг на друга
    var nears = world.getNear(lifer);
    if (nears.length > 0) {
        var nearest = getNearest(nears, lifer);
        if (getRange(nearest, lifer) < lifer.radius) {
            name = 'escape';
            vector = {x: nearest.x, y: nearest.y};
        }
    }

    switch (name) {

        case 'random':
            var angle = rand(0, 360);
            // для рандома удобнее сразу задавать угол
            lifer.dy = Math.sin(angle * (Math.PI / 180)) * lifer.speed;
            lifer.dx = Math.cos(angle * (Math.PI / 180)) * lifer.speed;
            break;
        // используем информацию о текущем импульсе через объект lifer: получаем и сохраняем
        case 'particle':
            // если импульса нет
            if (!lifer.hasOwnProperty('dx') && !lifer.hasOwnProperty('dy')) {
                var angle = rand(0, 360);
                lifer.dx = Math.cos(angle * (Math.PI / 180)) * lifer.speed;
                lifer.dy = Math.sin(angle * (Math.PI / 180)) * lifer.speed;
            }
            break;
        case 'circle':
            // параметрическое движение
            let radius = 150;
            let center = [world.width / 2, world.height / 2];

            // маштабируем до градусов
            let degree = world.tick % 360;
            // и переводим в радианы
            let theta = degree * (2 * Math.PI / 360);
            lifer.x = center[0] + radius * Math.cos(theta);
            lifer.y = center[1] - radius * Math.sin(theta);
            // для параметрического движения дальнейшие действия не нужны
            return;
        case 'chase':
            vector = [lifer.x - vector.x, lifer.y - vector.y];
            c = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
            lifer.dx = -(vector[0] / c) * lifer.speed;
            lifer.dy = -(vector[1] / c) * lifer.speed;
            break;
        case 'escape':
            vector = [lifer.x - vector.x, lifer.y - vector.y];
            c = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
            lifer.dx = (vector[0] / c) * lifer.speed;
            lifer.dy = (vector[1] / c) * lifer.speed;
            break;
        default:
            lifer.dx = 0;
            lifer.dy = 0;
            break;
    }

    // не пересекаем границы мира. Продумать этот момент
    if (lifer.x + lifer.dx >= world.width || lifer.x + lifer.dx <= 0) {
        lifer.dx = -lifer.dx;
    }
    if (lifer.y + lifer.dy >= world.height || lifer.y + lifer.dy <= 0) {
        lifer.dy = -lifer.dy;
    }

	// всё что делает Anim - обновляет координаты объекта
	lifer.x += lifer.dx;
	lifer.y += lifer.dy;
}
